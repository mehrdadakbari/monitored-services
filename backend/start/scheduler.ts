
import scheduler from 'adonisjs-scheduler/services/main'
import SimulateIncidents from '#commands/simulate_status'


scheduler.command(SimulateIncidents).everyMinute().withoutOverlapping()

