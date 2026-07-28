export const CATEGORIES = [
  { id: 'food', label: 'Food', color: '#F59E0B' },
  { id: 'shopping', label: 'Shopping', color: '#EC4899' },
  { id: 'salary', label: 'Salary', color: '#10B981' },
  { id: 'entertainment', label: 'Entertainment', color: '#8B5CF6' },
  { id: 'transport', label: 'Transport', color: '#3B82F6' },
  { id: 'general', label: 'General', color: '#6B7280' },
];

export const getCategoryColor = (categoryId) => {
  const category = CATEGORIES.find(c => c.id === categoryId || c.label.toLowerCase() === categoryId.toLowerCase());
  return category ? category.color : '#6B7280';
};
