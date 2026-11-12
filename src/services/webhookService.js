/**
 * Fix My City - SNS Workbench Webhook Integration Service
 * Primary Endpoint: https://api.agents.snsihub.ai/webhook/3c4473e9-1031-48f3-aa85-ff94a756e06b
 * Test Endpoint:    https://api.agents.snsihub.ai/webhook-test/3c4473e9-1031-48f3-aa85-ff94a756e06b
 */

export const DEFAULT_WEBHOOK_URL = 'https://api.agents.snsihub.ai/webhook/3c4473e9-1031-48f3-aa85-ff94a756e06b';
export const TEST_WEBHOOK_URL = 'https://api.agents.snsihub.ai/webhook-test/3c4473e9-1031-48f3-aa85-ff94a756e06b';

const STORAGE_KEY_WEBHOOK_CONFIG = 'fmc_webhook_config';

export function getWebhookConfig() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_WEBHOOK_CONFIG);
    if (saved) {
      return JSON.parse(saved);
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
 * Sends authentication credentials to the SNS Workbench Webhook
 * Explicitly indicates whether it is a "login" or "new account"
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
    account_type: eventLabel,    // "login" or "new account"
    auth_event: eventLabel,      // "login" or "new account"
    type: eventLabel,            // "login" or "new account"
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
 * Format complaint payload according to SNS Workbench specifications:
 * Includes citizen credentials and indicates complaint submission action.
 */
export function buildComplaintPayload({
  name,
  location,
  email,
  password,
  image,
  complaint,
  queries_and_requests,
  category,
  id
}) {
  return {
    id: id || `FMC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    name: name?.trim() || '',
    location: location?.trim() || '',
    email: email?.trim().toLowerCase() || '',
    password: password || '',
    account_type: 'existing_account_complaint',
    image: image ? image : null,
    complaint: complaint?.trim() || '',
    queries_and_requests: queries_and_requests?.trim() || null,
    category: category || 'Civic Issue',
    action: 'complaint_submission',
    submitted_at: new Date().toISOString()
  };
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
 * Diagnostic ping to test webhook connectivity with email & password
 */
export async function testWebhookHealth(url = null, isNewAccount = false) {
  const config = getWebhookConfig();
  const targetUrl = url || config.url || DEFAULT_WEBHOOK_URL;
  const eventLabel = isNewAccount ? 'new account' : 'login';

  try {
    const res = await dispatchToWebhookWithFallback(targetUrl, {
      name: isNewAccount ? "New Resident Test" : "Existing Citizen Test",
      email: isNewAccount ? "new.citizen@fixmycity.org" : "alex.morgan@fixmycity.org",
      password: isNewAccount ? "NewCitizenPass@123" : "Password@123",
      account_type: eventLabel,
      auth_event: eventLabel,
      type: eventLabel,
      action: eventLabel,
      is_new_account: Boolean(isNewAccount),
      description: isNewAccount ? 'Diagnostic ping: new account' : 'Diagnostic ping: login',
      location: "Central Operations",
      image: null,
      complaint: `Automated diagnostic test ping verifying [${eventLabel}] event delivery to SNS Workbench`,
      queries_and_requests: "Diagnostic ping",
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
