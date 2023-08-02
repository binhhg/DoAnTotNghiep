module.exports = (app, container) => {
    const { internalController } = container.resolve('controller')
    app.post('/internal/removeAll', internalController.removeAll)
}
