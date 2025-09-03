// Sample data for BloodLink demonstration
export interface BloodRequest {
  id: string;
  patientName: string;
  bloodGroup: string;
  rhFactor: "positive" | "negative";
  unitsNeeded: number;
  urgency: "immediate" | "urgent" | "scheduled";
  hospitalName: string;
  hospitalAddress: string;
  pincode: string;
  contactNumber: string;
  requestDate: Date;
  status: "pending" | "matched" | "fulfilled";
}

export interface Donor {
  id: string;
  name: string;
  bloodGroup: string;
  rhFactor: "positive" | "negative";
  phone: string;
  address: string;
  pincode: string;
  lastDonationDate: Date | null;
  isAvailable: boolean;
  age: number;
  weight: number;
  eligibilityStatus: "eligible" | "ineligible";
}

export interface BloodBank {
  id: string;
  name: string;
  address: string;
  pincode: string;
  contactNumber: string;
  inventory: BloodInventory[];
  operatingHours: string;
  certificationNumber: string;
}

export interface BloodInventory {
  bloodGroup: string;
  rhFactor: "positive" | "negative";
  unitsAvailable: number;
  expiryDate: Date;
}

// Sample blood requests
export const sampleBloodRequests: BloodRequest[] = [
  {
    id: "req-001",
    patientName: "Rajesh Kumar",
    bloodGroup: "O",
    rhFactor: "negative",
    unitsNeeded: 2,
    urgency: "immediate",
    hospitalName: "City Medical Center",
    hospitalAddress: "123 MG Road, Central Delhi",
    pincode: "110001",
    contactNumber: "+91-9876543210",
    requestDate: new Date(),
    status: "pending"
  },
  {
    id: "req-002",
    patientName: "Priya Sharma",
    bloodGroup: "AB",
    rhFactor: "positive",
    unitsNeeded: 1,
    urgency: "urgent",
    hospitalName: "Apollo Hospital",
    hospitalAddress: "456 Ring Road, South Delhi",
    pincode: "110017",
    contactNumber: "+91-9876543211",
    requestDate: new Date(Date.now() - 3600000), // 1 hour ago
    status: "matched"
  },
  {
    id: "req-003",
    patientName: "Amit Patel",
    bloodGroup: "B",
    rhFactor: "positive",
    unitsNeeded: 3,
    urgency: "scheduled",
    hospitalName: "Max Healthcare",
    hospitalAddress: "789 Nehru Place, East Delhi",
    pincode: "110019",
    contactNumber: "+91-9876543212",
    requestDate: new Date(Date.now() - 7200000), // 2 hours ago
    status: "pending"
  }
];

// Sample donors
export const sampleDonors: Donor[] = [
  {
    id: "don-001",
    name: "Arjun Singh",
    bloodGroup: "O",
    rhFactor: "negative",
    phone: "+91-9876543213",
    address: "45 CP Market, Central Delhi",
    pincode: "110001",
    lastDonationDate: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000), // 95 days ago
    isAvailable: true,
    age: 28,
    weight: 70,
    eligibilityStatus: "eligible"
  },
  {
    id: "don-002",
    name: "Sneha Gupta",
    bloodGroup: "AB",
    rhFactor: "positive",
    phone: "+91-9876543214",
    address: "12 Lajpat Nagar, South Delhi",
    pincode: "110024",
    lastDonationDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // 120 days ago
    isAvailable: true,
    age: 32,
    weight: 55,
    eligibilityStatus: "eligible"
  },
  {
    id: "don-003",
    name: "Rohit Mehta",
    bloodGroup: "B",
    rhFactor: "positive",
    phone: "+91-9876543215",
    address: "78 Karol Bagh, West Delhi",
    pincode: "110005",
    lastDonationDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
    isAvailable: false,
    age: 26,
    weight: 68,
    eligibilityStatus: "ineligible"
  }
];

// Sample blood banks
export const sampleBloodBanks: BloodBank[] = [
  {
    id: "bb-001",
    name: "Red Cross Blood Bank",
    address: "Red Cross Bhawan, Parliament Street",
    pincode: "110001",
    contactNumber: "+91-11-23711551",
    operatingHours: "24/7",
    certificationNumber: "RC-BB-001",
    inventory: [
      { bloodGroup: "O", rhFactor: "positive", unitsAvailable: 25, expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      { bloodGroup: "O", rhFactor: "negative", unitsAvailable: 8, expiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000) },
      { bloodGroup: "A", rhFactor: "positive", unitsAvailable: 15, expiryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000) },
      { bloodGroup: "A", rhFactor: "negative", unitsAvailable: 5, expiryDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000) },
      { bloodGroup: "B", rhFactor: "positive", unitsAvailable: 12, expiryDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000) },
      { bloodGroup: "B", rhFactor: "negative", unitsAvailable: 3, expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) },
      { bloodGroup: "AB", rhFactor: "positive", unitsAvailable: 7, expiryDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000) },
      { bloodGroup: "AB", rhFactor: "negative", unitsAvailable: 2, expiryDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000) }
    ]
  },
  {
    id: "bb-002",
    name: "AIIMS Blood Bank",
    address: "All India Institute of Medical Sciences, Ansari Nagar",
    pincode: "110029",
    contactNumber: "+91-11-26588663",
    operatingHours: "24/7",
    certificationNumber: "AIIMS-BB-002",
    inventory: [
      { bloodGroup: "O", rhFactor: "positive", unitsAvailable: 30, expiryDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000) },
      { bloodGroup: "O", rhFactor: "negative", unitsAvailable: 12, expiryDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000) },
      { bloodGroup: "A", rhFactor: "positive", unitsAvailable: 20, expiryDate: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000) },
      { bloodGroup: "A", rhFactor: "negative", unitsAvailable: 8, expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      { bloodGroup: "B", rhFactor: "positive", unitsAvailable: 18, expiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000) },
      { bloodGroup: "B", rhFactor: "negative", unitsAvailable: 6, expiryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000) },
      { bloodGroup: "AB", rhFactor: "positive", unitsAvailable: 10, expiryDate: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000) },
      { bloodGroup: "AB", rhFactor: "negative", unitsAvailable: 4, expiryDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000) }
    ]
  },
  {
    id: "bb-003",
    name: "Safdarjung Hospital Blood Bank",
    address: "Safdarjung Hospital, Ring Road",
    pincode: "110029",
    contactNumber: "+91-11-26165060",
    operatingHours: "6 AM - 10 PM",
    certificationNumber: "SJ-BB-003",
    inventory: [
      { bloodGroup: "O", rhFactor: "positive", unitsAvailable: 22, expiryDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000) },
      { bloodGroup: "O", rhFactor: "negative", unitsAvailable: 6, expiryDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000) },
      { bloodGroup: "A", rhFactor: "positive", unitsAvailable: 14, expiryDate: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000) },
      { bloodGroup: "A", rhFactor: "negative", unitsAvailable: 4, expiryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000) },
      { bloodGroup: "B", rhFactor: "positive", unitsAvailable: 16, expiryDate: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000) },
      { bloodGroup: "B", rhFactor: "negative", unitsAvailable: 3, expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) },
      { bloodGroup: "AB", rhFactor: "positive", unitsAvailable: 8, expiryDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000) },
      { bloodGroup: "AB", rhFactor: "negative", unitsAvailable: 2, expiryDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000) }
    ]
  }
];

// Blood compatibility logic
export const getCompatibleDonors = (patientBloodGroup: string, patientRhFactor: string): string[] => {
  const compatibility: Record<string, string[]> = {
    "O-": ["O-"],
    "O+": ["O-", "O+"],
    "A-": ["O-", "A-"],
    "A+": ["O-", "O+", "A-", "A+"],
    "B-": ["O-", "B-"],
    "B+": ["O-", "O+", "B-", "B+"],
    "AB-": ["O-", "A-", "B-", "AB-"],
    "AB+": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"]
  };
  
  const patientType = `${patientBloodGroup}${patientRhFactor === "positive" ? "+" : "-"}`;
  return compatibility[patientType] || [];
};

// Pincode to area mapping for Delhi NCR
export const pincodeAreas: Record<string, string> = {
  "110001": "Central Delhi",
  "110002": "Central Delhi",
  "110003": "Central Delhi",
  "110004": "Central Delhi",
  "110005": "West Delhi",
  "110006": "Central Delhi",
  "110007": "Central Delhi",
  "110008": "Central Delhi",
  "110009": "Central Delhi",
  "110010": "Central Delhi",
  "110011": "Central Delhi",
  "110012": "Central Delhi",
  "110013": "Central Delhi",
  "110014": "Central Delhi",
  "110015": "West Delhi",
  "110016": "North Delhi",
  "110017": "South Delhi",
  "110018": "West Delhi",
  "110019": "East Delhi",
  "110020": "North Delhi",
  "110021": "North Delhi",
  "110022": "North Delhi",
  "110023": "East Delhi",
  "110024": "South Delhi",
  "110025": "East Delhi",
  "110026": "West Delhi",
  "110027": "West Delhi",
  "110028": "West Delhi",
  "110029": "South Delhi",
  "110030": "East Delhi"
};