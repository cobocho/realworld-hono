import pino from 'pino';

export const sqlLogger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      destination: './logs/sql.log',
      mkdir: true,
    },
  },
});

export const logger = pino(
  {
    level: 'info',
  },
  pino.destination({
    dest: './logs/requests.log',
    mkdir: true,
  })
);
