export interface PatientInfo {
  name: string;
  age: number;
  gender: string;
  labNo: string;
  refBy: string;
  collected: string;
  reported: string;
  acStatus: string;
  reportStatus: string;
  collectedAt: string;
  processedAt: string;
}

export interface TestResult {
  name: string;
  results: string;
  units: string;
  refInterval: string;
  status?: 'Normal' | 'High' | 'Low';
  method?: string;
}

export const reportData = {
  patient: {
    name: "Ms. POOJA",
    age: 24,
    gender: "Female",
    labNo: "15678436",
    refBy: "Self",
    collected: "10/3/2026 11:56:00AM",
    reported: "10/3/2026 5:26:03PM",
    acStatus: "P",
    reportStatus: "Final",
    collectedAt: "KALADHUNGI ROAD, Anand Number Building, Bal Vidaya Mandir Intel College, Kaladungi Road, Heera Nagar, Haldwani, Uttarakhand - 263139",
    processedAt: "Dr. Lal PathLabs Ltd, Anand Number Building, Bal Vidaya Mandir Intel College, Kaladungi Road, Heera Nagar, Haldwani, Uttarakhand - 263139",
  },
  results: [
    { name: "URIC ACID, SERUM", results: "5.08", units: "mg/dL", refInterval: "2.60 - 6.00", method: "(Uricase)" },
    { name: "HEMOGLOBIN; Hb", results: "14.00", units: "g/dL", refInterval: "12.00 - 15.00", method: "(SLS)" },
    { name: "GLUCOSE, FASTING (F), PLASMA", results: "90.50", units: "mg/dL", refInterval: "70.00 - 100.00", method: "(Hexokinase)" },
    { name: "CALCIUM, SERUM", results: "9.30", units: "mg/dL", refInterval: "8.80 - 10.60", method: "(Arsenazo III)" },
    { name: "TSH (THYROID STIMULATING HORMONE), TOTAL", results: "1.17", units: "µIU/mL", refInterval: "0.27 - 4.20", method: "(ECLIA)" },
  ],
  lipidScreen: [
    { name: "Cholesterol, Total", results: "126.60", units: "mg/dL", refInterval: "<200.00", method: "(CHO-POD)" },
    { name: "Triglycerides", results: "152.00", units: "mg/dL", refInterval: "<150.00", status: "High", method: "(GPO-POD)" },
    { name: "HDL Cholesterol", results: "40.01", units: "mg/dL", refInterval: ">50.00", status: "Low", method: "(Direct Enzymatic)" },
    { name: "LDL Cholesterol, Calculated", results: "56.19", units: "mg/dL", refInterval: "<100.00", method: "(Calculated)" },
    { name: "VLDL Cholesterol, Calculated", results: "30.40", units: "mg/dL", refInterval: "<30.00", status: "High", method: "(Calculated)" },
    { name: "Non-HDL Cholesterol", results: "87", units: "mg/dL", refInterval: "<130", method: "(Calculated)" },
  ],
  riskTables: [
    { category: "Extreme Risk Group Category A", treatmentGoalLDL: "<50", treatmentGoalNonHDL: "<80", considerLDL: "≥50", considerNonHDL: "≥80" },
    { category: "Extreme Risk Group Category B", treatmentGoalLDL: "≤30", treatmentGoalNonHDL: "≤60", considerLDL: ">30", considerNonHDL: ">60" },
    { category: "Very High", treatmentGoalLDL: "<50", treatmentGoalNonHDL: "<80", considerLDL: "≥50", considerNonHDL: "≥80" },
    { category: "High", treatmentGoalLDL: "<70", treatmentGoalNonHDL: "<100", considerLDL: "≥70", considerNonHDL: "≥100" },
    { category: "Moderate", treatmentGoalLDL: "<100", treatmentGoalNonHDL: "<130", considerLDL: "≥100", considerNonHDL: "≥130" },
    { category: "Low", treatmentGoalLDL: "<100", treatmentGoalNonHDL: "<130", considerLDL: "≥130*", considerNonHDL: "≥160*" },
  ]
};
