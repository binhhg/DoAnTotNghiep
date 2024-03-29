module.exports = (app, container) => {
  const { eventController } = container.resolve('controller')
  app.post('/event', eventController.addEvent)
  app.get('/event', eventController.getEvent)
  app.patch('/event/:id', eventController.deleteEvent)
  app.put('/event/:id/level', eventController.updateLevel)
  app.put('/event/:id', eventController.updateEvent)
}
