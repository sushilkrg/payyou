export const getHealthInfo = (req, res) => {
  return res.status(200).json({ message: "Backend is active" });
};
