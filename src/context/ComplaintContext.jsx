import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_COMPLAINTS, INITIAL_QUERIES } from '../constants/mockData';
import { submitComplaintToWebhook, buildComplaintPayload, uploadImageToStorage } from '../services/webhookService';
import { useAuth } from './AuthContext';

const ComplaintContext = createContext(null);

const STORAGE_KEY_COMPLAINTS = 'fmc_stored_complaints';
const STORAGE_KEY_QUERIES = 'fmc_stored_queries';

export function ComplaintProvider({ children }) {
  const { user } = useAuth();

  const [complaints, setComplaints] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPLAINTS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading complaints from localStorage:', e);
    }
    return INITIAL_COMPLAINTS;
  });

  const [queries, setQueries] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_QUERIES);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading queries from localStorage:', e);
    }
    return INITIAL_QUERIES;
  });

  const [submitting, setSubmitting] = useState(false);
  const [lastSubmissionResult, setLastSubmissionResult] = useState(null);

  // Sync complaints to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COMPLAINTS, JSON.stringify(complaints));
    } catch (e) {
      console.error('Error saving complaints to localStorage:', e);
    }
  }, [complaints]);

  // Sync queries to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_QUERIES, JSON.stringify(queries));
    } catch (e) {
      console.error('Error saving queries to localStorage:', e);
    }
  }, [queries]);

  /**
   * Submits complaint to SNS Workbench Webhook API
   * Automatically uploads image to accessible storage first if present,
   * constructs the required payload, and dispatches via HTTP POST.
   */
  const submitComplaint = async (formData, forceLocalSaveOnFailure = false) => {
    setSubmitting(true);
    const generatedId = `FMC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 1. Upload image to accessible storage if an image is attached
    let finalImageUrl = null;
    if (formData.image) {
      try {
        finalImageUrl = await uploadImageToStorage(formData.image);
      } catch (uploadErr) {
        console.warn('Image upload notice:', uploadErr);
      }
    }

    // 2. Build exact JSON structure required by SNS Workbench
    const payload = buildComplaintPayload({
      name: formData.name,
      location: formData.location,
      email: formData.email || user?.email || '',
      image: finalImageUrl,
      complaint: formData.complaint,
      queries_and_requests: formData.queries_and_requests,
      submitted_at: new Date().toISOString()
    });

    // 3. Dispatch to webhook
    const apiResult = await submitComplaintToWebhook(payload);
    setLastSubmissionResult(apiResult);

    const nowFormatted = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const newComplaintRecord = {
      id: generatedId,
      name: payload.name,
      email: payload.email,
      location: payload.location,
      complaint: payload.complaint,
      queries_and_requests: payload.queries_and_requests,
      category: formData.category || 'General Civic Issue',
      image: finalImageUrl || formData.image,
      status: 'Submitted',
      submitted_at: payload.submitted_at,
      assigned_dept: 'Civic Grievance Redressal Cell',
      officer: 'Assigned via SNS Workbench Dispatch',
      timeline: [
        {
          status: 'Submitted',
          time: nowFormatted,
          note: apiResult.success
            ? 'Transmitted and received by SNS Workbench Webhook'
            : `Logged locally (${apiResult.error || 'Webhook offline'})`
        }
      ],
      is_mock: false,
      api_status: apiResult.success ? 'synced' : 'pending_sync'
    };

    // Save to existing database only if webhook confirmed success OR if user explicitly forced local save
    if (apiResult.success || forceLocalSaveOnFailure) {
      setComplaints((prev) => [newComplaintRecord, ...prev]);
    }

    setSubmitting(false);

    return {
      success: apiResult.success,
      complaint: newComplaintRecord,
      apiResult
    };
  };

  /**
   * Submits a civic query or assistance request
   */
  const submitQuery = async ({ title, category, description, citizenName, citizenEmail }) => {
    const generatedId = `QRY-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const payload = buildComplaintPayload({
      name: citizenName,
      location: 'Ward Inquiry Desk',
      email: citizenEmail || user?.email || '',
      password: user?.password || 'CitizenPassword@123',
      complaint: `[CIVIC QUERY / REQUEST]: ${title} - ${description}`,
      queries_and_requests: description,
      category: category,
      id: generatedId
    });

    submitComplaintToWebhook(payload).catch((err) => console.log('Query webhook notice:', err));

    const newQuery = {
      id: generatedId,
      title,
      category: category || 'General Assistance',
      status: 'Under Review',
      description,
      response: 'Your query has been forwarded to the municipal public relations desk. Average response time is 24–48 hours.',
      submitted_at: new Date().toISOString(),
      answered_by: 'Pending Ward Officer Assignment'
    };

    setQueries((prev) => [newQuery, ...prev]);
    return newQuery;
  };

  const getComplaintById = (id) => {
    return complaints.find((c) => c.id === id);
  };

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        queries,
        submitting,
        lastSubmissionResult,
        submitComplaint,
        submitQuery,
        getComplaintById,
        setComplaints
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
}

export function useComplaints() {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
}
