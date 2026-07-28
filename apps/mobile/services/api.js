// Local IP address of your PC for testing on physical devices (iOS / Android)
const BASE_URL = 'http://192.168.1.48:8000';

export const getTransactions = async () => {
  try {
    const response = await fetch(`${BASE_URL}/transactions`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
};

export const getSummary = async () => {
  try {
    const response = await fetch(`${BASE_URL}/summary`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching summary:', error);
    return { balance: 0, total_income: 0, total_expense: 0 };
  }
};

export const createTransaction = async (transactionData) => {
  try {
    const response = await fetch(`${BASE_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};