export const INITIAL_COMPLAINTS = [
  {
    id: "FMC-2026-8812",
    name: "Alex Morgan",
    email: "alex.morgan@fixmycity.org",
    location: "42 MG Road, Ward 14, Near City Central Library",
    complaint: "Deep hazardous pothole on the eastbound lane causing severe traffic slowdown and two-wheeler skidding risks during rain.",
    queries_and_requests: "Please prioritize before monsoon rains intensify. A speed bump request was also raised earlier.",
    category: "Roads & Potholes",
    image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80",
    status: "Under Review",
    submitted_at: "2026-11-08T09:30:00.000Z",
    assigned_dept: "Department of Municipal Roads & Works",
    officer: "Er. V. Ramanathan (Ward Engineer)",
    timeline: [
      { status: "Submitted", time: "Nov 8, 2026 09:30 AM", note: "Complaint logged and dispatched via SNS Workbench" },
      { status: "Under Review", time: "Nov 8, 2026 02:15 PM", note: "Assigned to Ward 14 Road Maintenance Division" }
    ],
    is_mock: true
  },
  {
    id: "FMC-2026-7945",
    name: "Alex Morgan",
    email: "alex.morgan@fixmycity.org",
    location: "Cross Cut Street, Corner of 5th Avenue, Ward 8",
    complaint: "Streetlight pole #SL-804 has been flickering and completely off for the last 4 nights, making the junction unsafe for pedestrians.",
    queries_and_requests: "Can LED upgrade also be done for the remaining two lamps on this lane?",
    category: "Street Lighting",
    image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80",
    status: "In Progress",
    submitted_at: "2026-11-05T18:45:00.000Z",
    assigned_dept: "Electrical & Public Illumination Board",
    officer: "K. Selvam (Field Electrician)",
    timeline: [
      { status: "Submitted", time: "Nov 5, 2026 06:45 PM", note: "Complaint logged" },
      { status: "Under Review", time: "Nov 6, 2026 10:00 AM", note: "Inspection verified lamp driver fault" },
      { status: "In Progress", time: "Nov 7, 2026 11:30 AM", note: "Work order issued to maintenance squad" }
    ],
    is_mock: true
  },
  {
    id: "FMC-2026-6210",
    name: "Alex Morgan",
    email: "alex.morgan@fixmycity.org",
    location: "Gandhi Park Outer Perimeter, Ward 12",
    complaint: "Overflowing municipal garbage bin near the community walking trail. Stray dogs are scattering waste onto the walkway.",
    queries_and_requests: "Request daily clearance schedule and installation of a closed lid dumpster.",
    category: "Sanitation & Waste",
    image: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=600&q=80",
    status: "Resolved",
    submitted_at: "2026-10-28T08:15:00.000Z",
    assigned_dept: "Solid Waste Management Authority",
    officer: "M. Anitha (Sanitation Supervisor)",
    timeline: [
      { status: "Submitted", time: "Oct 28, 2026 08:15 AM", note: "Complaint logged" },
      { status: "Under Review", time: "Oct 28, 2026 11:00 AM", note: "Dispatch notified" },
      { status: "In Progress", time: "Oct 29, 2026 07:30 AM", note: "Waste compacting vehicle deployed" },
      { status: "Resolved", time: "Oct 29, 2026 04:00 PM", note: "Perimeter cleared, sanitized with bleaching powder, and closed bin installed" }
    ],
    is_mock: true
  }
];

export const INITIAL_QUERIES = [
  {
    id: "QRY-2026-104",
    title: "Drinking water pipeline maintenance timings in Ward 14",
    category: "Water Supply",
    status: "Answered",
    description: "What are the scheduled water supply timings for November following the reservoir pipeline upgrade?",
    response: "The updated pipeline schedule for Ward 14 is 6:00 AM – 9:30 AM on alternate days (Tuesday, Thursday, Saturday). Pressure maintenance is currently stable at 2.4 bar.",
    submitted_at: "2026-11-06T14:20:00.000Z",
    answered_by: "City Water & Sewerage Board"
  },
  {
    id: "QRY-2026-092",
    title: "Procedure for requesting community sapling plantation drive",
    category: "Parks & Environment",
    status: "Answered",
    description: "Our resident welfare association wants to plant 50 indigenous trees along the neighborhood perimeter. Does the municipality provide saplings?",
    response: "Yes! Under the 'Green City Horizon' scheme, citizens and RWAs can collect up to 100 free saplings from the Central Nursery, Race Course Road, Mon-Sat 9 AM to 4 PM.",
    submitted_at: "2026-10-30T10:15:00.000Z",
    answered_by: "Urban Forestry Division"
  }
];

export const CITY_ANNOUNCEMENTS = [
  {
    id: 1,
    tag: "Road Work",
    title: "Flyover Expansion Asphalt Resurfacing",
    desc: "Avenue 3 traffic diversion active from Nov 11 to Nov 15 between 11 PM and 5 AM.",
    date: "Active Today",
    badge: "Info"
  },
  {
    id: 2,
    tag: "Sanitation",
    title: "Zero-Plastic Citizen Cleanliness Drive",
    desc: "Join your ward sanitation volunteers this Saturday at Lakefront Promenade.",
    date: "Coming Saturday",
    badge: "Event"
  },
  {
    id: 3,
    tag: "Helpline",
    title: "Monsoon 24/7 Rapid Response Desk Opened",
    desc: "Dial 1913 or use the Fix My City app for emergency water-logging drainage assistance.",
    date: "24/7 Live",
    badge: "Urgent"
  }
];

export const COMMON_CATEGORIES = [
  "Roads & Potholes",
  "Street Lighting",
  "Sanitation & Waste",
  "Water Supply & Drainage",
  "Traffic & Parking",
  "Parks & Public Amenities",
  "Public Health & Mosquito Fogging",
  "Other Civic Issue"
];

