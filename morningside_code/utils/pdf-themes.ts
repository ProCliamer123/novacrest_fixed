export interface Theme {
  name: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  textColor: string
  bgColor: string
  bgAccent: string
  fontFamily: string
}

export const themes: Theme[] = [
  {
    name: "Classic",
    primaryColor: "#1a365d",
    secondaryColor: "#2c5282",
    accentColor: "#2b6cb0",
    textColor: "#2d3748",
    bgColor: "#ffffff",
    bgAccent: "#f7fafc",
    fontFamily: "'Georgia', serif",
  },
  {
    name: "Modern",
    primaryColor: "#000000",
    secondaryColor: "#4a5568",
    accentColor: "#718096",
    textColor: "#1a202c",
    bgColor: "#ffffff",
    bgAccent: "#f7fafc",
    fontFamily: "'Inter', 'Helvetica', sans-serif",
  },
  {
    name: "Vibrant",
    primaryColor: "#6b21a8",
    secondaryColor: "#7e22ce",
    accentColor: "#a855f7",
    textColor: "#3b0764",
    bgColor: "#ffffff",
    bgAccent: "#f5f3ff",
    fontFamily: "'Poppins', sans-serif",
  },
  {
    name: "Earthy",
    primaryColor: "#5c4033",
    secondaryColor: "#8b5a2b",
    accentColor: "#a0522d",
    textColor: "#3c2a21",
    bgColor: "#fff8e7",
    bgAccent: "#f5f0e5",
    fontFamily: "'Verdana', sans-serif",
  },
  {
    name: "Corporate",
    primaryColor: "#0e7490",
    secondaryColor: "#0891b2",
    accentColor: "#06b6d4",
    textColor: "#0c4a6e",
    bgColor: "#ffffff",
    bgAccent: "#ecfeff",
    fontFamily: "'Arial', sans-serif",
  },
]
