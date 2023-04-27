const axios = require('axios').default
async function getRefreshToken() {
    try {
        const response = await axios.post(
            'https://oauth2.googleapis.com/token',
            {
                client_id: "217109832798-u2oasqosr3fa40n9nkmfvluq65vrkjbd.apps.googleusercontent.com",
                client_secret: "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",
                refresh_token: "APZUo0R8s7P_SJ_PHex1YBZA4nKob-wYuv85qXfqQnXBqQLUT-o6gUIXBor_5dwNdZUhsnrx1ACPOYPo5YUP2y0mZs8CN-YlHr48PWOuOZXpv1bytyvT4E6P0cQyXxaXAUxuAUvemsmYNHO3n7EiHPK0yDgPj2Qokuo1ARfXdgOYDfTHa7HkXddDqyGyx3briTtEH0A_Cxzv-3Ls9gA50MNeEG3I-wjNAM1eMd8G0ea_jWnuipicxYzVua38R7qDvpb2uPyaCVKmUbdWuMJVijFdzjUTqRtGnvS5vm1NCmbCYsv84pO3nVl1kpDTMMonRuE9Ewy17DFJFOolNu3oamUnGMPLopJB8to7xrXc96xFyWfv8jAJ9nM7enY7-aKTEuPViQWLW1OOA3lpzGJWVTWYnucvVmipP-lS5Js3AEVimcDcUfuw9xI",
                grant_type: 'refresh_token',
            }
        );
        const data = response.data;
        return data.refresh_token;
    } catch (error) {
        console.error(error);
    }
}
getRefreshToken().then()
