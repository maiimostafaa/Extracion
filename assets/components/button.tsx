export interface ButtonProps {
  label: string; // Text to display on the button
  onClick: () => void; // Function to call when the button is clicked
  disabled?: boolean; // Optional prop to disable the button
  color: string; // Color of the button, e.g., "primary", "secondary"
  height: number; // Height of the button in pixels
  width: number; // Width of the button in pixels
  justifyContent?: "center" | "flex-start" | "flex-end"; // Justification of content within the button
}
