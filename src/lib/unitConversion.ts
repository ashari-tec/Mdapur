// ===== UNIT CONVERSION SYSTEM =====
// Sistem konversi satuan untuk sinkronisasi stok dan resep

export interface UnitConversion {
  [ingredientName: string]: {
    baseUnit: 'gram' | 'ml'; // Satuan dasar untuk bahan ini
    conversions: {
      [unit: string]: number; // Faktor konversi ke satuan dasar
    };
  };
}

// Database konversi satuan per bahan makanan
export const UNIT_CONVERSIONS: UnitConversion = {
  // === BAHAN KERING ===
  'beras': {
    baseUnit: 'gram',
    conversions: {
      'gram': 1,
      'kg': 1000,
      'porsi': 150, // 1 porsi nasi = 150g beras
      'gelas': 200, // 1 gelas beras = 200g
      'cangkir': 185,
    }
  },
  'tepung terigu': {
    baseUnit: 'gram',
    conversions: {
      'gram': 1,
      'kg': 1000,
      'sdm': 8, // 1 sdm tepung = 8g
      'sdt': 3, // 1 sdt tepung = 3g
      'gelas': 125, // 1 gelas tepung = 125g
      'cangkir': 125,
    }
  },
  'gula pasir': {
    baseUnit: 'gram',
    conversions: {
      'gram': 1,
      'kg': 1000,
      'sdm': 12, // 1 sdm gula = 12g
      'sdt': 4, // 1 sdt gula = 4g
      'gelas': 200, // 1 gelas gula = 200g
      'cangkir': 200,
    }
  },
  'garam': {
    baseUnit: 'gram',
    conversions: {
      'gram': 1,
      'kg': 1000,
      'sdm': 18, // 1 sdm garam = 18g
      'sdt': 6, // 1 sdt garam = 6g
      'sendok teh': 6,
      'sendok makan': 18,
    }
  },
  'bawang merah': {
    baseUnit: 'gram',
    conversions: {
      'gram': 1,
      'kg': 1000,
      'siung': 15, // 1 siung bawang merah = 15g
      'buah': 30, // 1 buah bawang merah = 30g
      'butir': 15,
    }
  },
  'bawang putih': {
    baseUnit: 'gram',
    conversions: {
      'gram': 1,
      'kg': 1000,
      'siung': 5, // 1 siung bawang putih = 5g
      'buah': 25, // 1 buah bawang putih = 25g
    }
  },
  'telur ayam': {
    baseUnit: 'gram',
    conversions: {
      'gram': 1,
      'kg': 1000,
      'butir': 60, // 1 butir telur = 60g
      'buah': 60,
    }
  },
  'cabai merah': {
    baseUnit: 'gram',
    conversions: {
      'gram': 1,
      'kg': 1000,
      'buah': 15, // 1 buah cabai = 15g
      'batang': 15,
    }
  },
  'tomat': {
    baseUnit: 'gram',
    conversions: {
      'gram': 1,
      'kg': 1000,
      'buah': 100, // 1 buah tomat = 100g
    }
  },

  // === BAHAN CAIR ===
  'minyak goreng': {
    baseUnit: 'ml',
    conversions: {
      'ml': 1,
      'liter': 1000,
      'sdm': 15, // 1 sdm minyak = 15ml
      'sdt': 5, // 1 sdt minyak = 5ml
      'gelas': 250, // 1 gelas = 250ml
      'cangkir': 250,
    }
  },
  'air': {
    baseUnit: 'ml',
    conversions: {
      'ml': 1,
      'liter': 1000,
      'sdm': 15,
      'sdt': 5,
      'gelas': 250,
      'cangkir': 250,
    }
  },
  'santan': {
    baseUnit: 'ml',
    conversions: {
      'ml': 1,
      'liter': 1000,
      'sdm': 15,
      'sdt': 5,
      'gelas': 250,
      'kemasan': 200, // 1 kemasan santan = 200ml
    }
  },
  'kecap manis': {
    baseUnit: 'ml',
    conversions: {
      'ml': 1,
      'liter': 1000,
      'sdm': 15,
      'sdt': 5,
    }
  },
  'saus tiram': {
    baseUnit: 'ml',
    conversions: {
      'ml': 1,
      'liter': 1000,
      'sdm': 15,
      'sdt': 5,
    }
  },

  // === BUMBU & REMPAH ===
  'merica': {
    baseUnit: 'gram',
    conversions: {
      'gram': 1,
      'kg': 1000,
      'sdt': 2, // 1 sdt merica = 2g
      'sdm': 6, // 1 sdm merica = 6g
    }
  },
  'jahe': {
    baseUnit: 'gram',
    conversions: {
      'gram': 1,
      'kg': 1000,
      'cm': 10, // 1 cm jahe = 10g
      'ruas': 15, // 1 ruas jahe = 15g
    }
  },
  'kunyit': {
    baseUnit: 'gram',
    conversions: {
      'gram': 1,
      'kg': 1000,
      'cm': 8, // 1 cm kunyit = 8g
      'ruas': 12, // 1 ruas kunyit = 12g
    }
  },
  'lengkuas': {
    baseUnit: 'gram',
    conversions: {
      'gram': 1,
      'kg': 1000,
      'cm': 12, // 1 cm lengkuas = 12g
      'ruas': 20, // 1 ruas lengkuas = 20g
    }
  },
};

/**
 * Konversi satuan ke satuan dasar
 */
export function convertToBaseUnit(
  ingredientName: string,
  quantity: number,
  unit: string
): { quantity: number; unit: 'gram' | 'ml' } | null {
  // Normalisasi nama bahan
  const normalizedName = ingredientName.toLowerCase().trim();
  
  // Cari konversi untuk bahan ini
  const conversion = UNIT_CONVERSIONS[normalizedName];
  if (!conversion) {
    console.warn(`Konversi tidak ditemukan untuk bahan: ${ingredientName}`);
    return null;
  }

  // Normalisasi nama satuan
  const normalizedUnit = unit.toLowerCase().trim();
  
  // Cari faktor konversi untuk satuan ini
  const conversionFactor = conversion.conversions[normalizedUnit];
  if (conversionFactor === undefined) {
    console.warn(`Satuan "${unit}" tidak ditemukan untuk bahan: ${ingredientName}`);
    return null;
  }

  // Konversi ke satuan dasar
  const baseQuantity = quantity * conversionFactor;
  
  return {
    quantity: baseQuantity,
    unit: conversion.baseUnit
  };
}

/**
 * Konversi dari satuan dasar ke satuan yang diinginkan
 */
export function convertFromBaseUnit(
  ingredientName: string,
  baseQuantity: number,
  targetUnit: string
): number | null {
  // Normalisasi nama bahan
  const normalizedName = ingredientName.toLowerCase().trim();
  
  // Cari konversi untuk bahan ini
  const conversion = UNIT_CONVERSIONS[normalizedName];
  if (!conversion) {
    console.warn(`Konversi tidak ditemukan untuk bahan: ${ingredientName}`);
    return null;
  }

  // Normalisasi nama satuan target
  const normalizedUnit = targetUnit.toLowerCase().trim();
  
  // Cari faktor konversi untuk satuan target
  const conversionFactor = conversion.conversions[normalizedUnit];
  if (conversionFactor === undefined) {
    console.warn(`Satuan "${targetUnit}" tidak ditemukan untuk bahan: ${ingredientName}`);
    return null;
  }

  // Konversi dari satuan dasar ke satuan target
  return baseQuantity / conversionFactor;
}

/**
 * Cek apakah stok cukup untuk resep
 */
export function isStockSufficient(
  ingredientName: string,
  stockQuantity: number,
  stockUnit: string,
  requiredQuantity: number,
  requiredUnit: string
): boolean {
  // Debug logging
  console.log(`Checking stock for ${ingredientName}: ${stockQuantity} ${stockUnit} vs required ${requiredQuantity} ${requiredUnit}`);
  
  // Konversi stok ke satuan dasar
  const stockInBase = convertToBaseUnit(ingredientName, stockQuantity, stockUnit);
  if (!stockInBase) {
    console.warn(`Konversi stok gagal untuk ${ingredientName} ${stockQuantity} ${stockUnit}`);
    return false;
  }
  
  console.log(`Stock in base: ${stockInBase.quantity} ${stockInBase.unit}`);

  // Konversi kebutuhan resep ke satuan dasar
  const requiredInBase = convertToBaseUnit(ingredientName, requiredQuantity, requiredUnit);
  if (!requiredInBase) {
    console.warn(`Konversi kebutuhan gagal untuk ${ingredientName} ${requiredQuantity} ${requiredUnit}`);
    return false;
  }
  
  console.log(`Required in base: ${requiredInBase.quantity} ${requiredInBase.unit}`);

  // Pastikan kedua bahan menggunakan satuan dasar yang sama
  if (stockInBase.unit !== requiredInBase.unit) {
    console.warn(`Satuan dasar tidak cocok untuk ${ingredientName}: ${stockInBase.unit} vs ${requiredInBase.unit}`);
    return false;
  }

  // Bandingkan jumlah dalam satuan dasar
  const result = stockInBase.quantity >= requiredInBase.quantity;
  console.log(`Stock sufficient result: ${result} (${stockInBase.quantity} >= ${requiredInBase.quantity})`);
  
  return result;
}

/**
 * Hitung kekurangan stok
 */
export function calculateStockDeficit(
  ingredientName: string,
  stockQuantity: number,
  stockUnit: string,
  requiredQuantity: number,
  requiredUnit: string
): { deficit: number; unit: 'gram' | 'ml' } | null {
  // Konversi stok ke satuan dasar
  const stockInBase = convertToBaseUnit(ingredientName, stockQuantity, stockUnit);
  if (!stockInBase) return null;

  // Konversi kebutuhan resep ke satuan dasar
  const requiredInBase = convertToBaseUnit(ingredientName, requiredQuantity, requiredUnit);
  if (!requiredInBase) return null;

  // Pastikan kedua bahan menggunakan satuan dasar yang sama
  if (stockInBase.unit !== requiredInBase.unit) {
    console.warn(`Satuan dasar tidak cocok untuk ${ingredientName}: ${stockInBase.unit} vs ${requiredInBase.unit}`);
    return null;
  }

  // Hitung kekurangan
  const deficit = requiredInBase.quantity - stockInBase.quantity;
  
  return deficit > 0 ? { deficit, unit: stockInBase.unit } : { deficit: 0, unit: stockInBase.unit };
}

/**
 * Dapatkan daftar satuan yang tersedia untuk bahan tertentu
 */
export function getAvailableUnits(ingredientName: string): string[] {
  const normalizedName = ingredientName.toLowerCase().trim();
  const conversion = UNIT_CONVERSIONS[normalizedName];
  
  if (!conversion) return [];
  
  return Object.keys(conversion.conversions);
}

/**
 * Dapatkan satuan dasar untuk bahan tertentu
 */
export function getBaseUnit(ingredientName: string): 'gram' | 'ml' | null {
  const normalizedName = ingredientName.toLowerCase().trim();
  const conversion = UNIT_CONVERSIONS[normalizedName];
  
  return conversion ? conversion.baseUnit : null;
}

/**
 * Tambahkan konversi baru untuk bahan yang belum ada
 */
export function addNewIngredientConversion(
  ingredientName: string,
  baseUnit: 'gram' | 'ml',
  conversions: { [unit: string]: number }
): void {
  const normalizedName = ingredientName.toLowerCase().trim();
  
  UNIT_CONVERSIONS[normalizedName] = {
    baseUnit,
    conversions: {
      [baseUnit]: 1, // Satuan dasar selalu 1
      ...conversions
    }
  };
}

/**
 * Format tampilan jumlah dengan satuan yang lebih user-friendly
 */
export function formatQuantityDisplay(
  ingredientName: string,
  quantity: number,
  unit: string
): string {
  // Jika jumlah terlalu kecil untuk satuan saat ini, coba konversi ke satuan yang lebih kecil
  if (quantity < 1) {
    const availableUnits = getAvailableUnits(ingredientName);
    const smallerUnits = ['sdt', 'sendok teh', 'sdm', 'sendok makan', 'ml', 'gram'];
    
    for (const smallerUnit of smallerUnits) {
      if (availableUnits.includes(smallerUnit)) {
        const converted = convertFromBaseUnit(ingredientName, quantity, smallerUnit);
        if (converted && converted >= 1) {
          return `${converted.toFixed(1)} ${smallerUnit}`;
        }
      }
    }
  }
  
  // Format normal dengan desimal jika diperlukan
  const formattedQuantity = quantity % 1 === 0 ? quantity.toString() : quantity.toFixed(1);
  return `${formattedQuantity} ${unit}`;
}