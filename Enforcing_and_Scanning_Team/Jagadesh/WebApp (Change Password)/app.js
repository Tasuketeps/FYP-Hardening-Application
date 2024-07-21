  app.post('/user/updateUserPassword', verifyToken, (req, res) => {
    const { currentPassword, newPassword, repeatPassword } = req.body;
    const userid = req.userid;

    console.log(userid)

    if (!userid) {
        return res.status(403).json({ error: 'User not authenticated.' });
    }

    updateUser(currentPassword, newPassword, repeatPassword, userid, function(err, result) {
        if (err) {
            console.error('Failed to update password:', err.message);
            return res.status(500).json({ error: err.message });
        } else {
            console.log('Password updated successfully.');
            return res.status(200).json({ message: 'Password updated successfully.' });
        }
    });
});
