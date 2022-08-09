function inject(bot) {
    bot.on("session_disconnect", (data) => {
        console.error(data);

        let timeout = 1000;

        if (
            data.extra?.find(
                (data) => data.text === "Wait 5 seconds before connecting, thanks! :)"
            )
        )
            timeout = 1000 * 6;

        process.abort(0)
    });
}

module.exports = { inject }