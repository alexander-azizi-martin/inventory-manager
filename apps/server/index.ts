import createApp from '~/app';

const isDev = process.env.NODE_ENV === 'development';

const server = createApp({
  logger: isDev ? { prettyPrint: true } : false,
});

server.listen(process.env.PORT || 3000, (err, address) => {
  if (err) {
    throw err;
  }

  server.log.info(`server listening on ${address}`);
});

process.on('exit', () => {
  server.close();
});
