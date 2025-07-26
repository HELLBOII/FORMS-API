interface FormRow {
  name: string;
  amount: number;
}

export async function saveRows(rows: FormRow[]): Promise<{ success: boolean }> {
  try {
    const response = await fetch('/api/save-rows', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rows }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to save rows:', error);
    throw error;
  }
}