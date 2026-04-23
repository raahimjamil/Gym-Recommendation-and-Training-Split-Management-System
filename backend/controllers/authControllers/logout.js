// logout.js (controller)
const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,     // true in production with HTTPS
    sameSite: "strict"
  });
  return res.json({ success: true, message: "Logged out successfully" });
};

export default logout;