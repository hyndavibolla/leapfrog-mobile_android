const brandMap = {
  'AllPosters.com': 'AllPosters',
  "Bloomin'Brands": "Bloomin' Brands",
  "Landry's RESTAURANTS": "Landry's Restaurants",
  'Levy RESTAURANTS': 'Levy Restaurants'
};

export const getBrandName = (brandName: string): string => {
  return brandMap[brandName] || brandName;
};
