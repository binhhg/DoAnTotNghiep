module.exports = (app, container) => {
    const { eventController } = container.resolve('controller')
    app.post('/event', eventController.addEvent)
    app.get('/event', eventController.getEvent)
}
