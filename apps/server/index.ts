import createApp from '~/app';

const isDev = process.env.NODE_ENV === 'development';

const server = createApp({
  logger: isDev ? { prettyPrint: true } : false,
});

const ADDRESS = isDev ? 'localhost' : '0.0.0.0';

server.listen(process.env.PORT || 5000, ADDRESS);

process.on('exit', async () => {
  await server.close();
});
