// src/utils/format.ts

export const formatCurrency = (amount: number, currency: string = 'NGN') => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    // This ensures the symbol (₦) is used instead of the code (NGN)
    currencyDisplay: 'symbol', 
  }).format(amount);
};

// src/utils/exportToCSV.ts
export const exportToCSV = (data: Record<string, any>[], filename: string) => {
  if (!data || !data.length) return;

  // Extract headers from the first object
  const headers = Object.keys(data[0]).join(',');

  // Map rows and escape quotes/commas
  const rows = data.map(row => 
    Object.values(row)
      .map(val => `"${String(val ?? '').replace(/"/g, '""')}"`)
      .join(',')
  );

  const csvContent = [headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const formatDate = (dateString: string | Date, formatType: 'standard' | 'short' = 'standard') => {
  if (!dateString) return '';

  const date = new Date(dateString);

  // Fallback just in case the backend sends a weird format
  if (isNaN(date.getTime())) return 'Invalid Date';

  if (formatType === 'short') {
    // Returns: "Dec 1, 2022" (Perfect for your Billing History table!)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  }

  // Returns: "December 1, 2022" (Standard)
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

