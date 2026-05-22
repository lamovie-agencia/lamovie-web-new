export const leadsService = {
  submitLead: async (data: { name: string; email?: string; phone?: string; service?: string; message?: string }) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error('No se pudo registrar la captación de leads en el servidor.');
      }
      return await res.json();
    } catch (err) {
      console.error('🔒 SECURE-LEAD SUBMISSION ERROR:', err);
      // Suppress UI-blocking failure so the user's focus on contacting isn't entirely blocked
      return { success: false, error: String(err) };
    }
  }
};
