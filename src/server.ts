import { app } from '~/app';
import { config } from '~/config';
import { logger } from '~/utils/logger';

app.listen(config.PORT, () => {
  logger.info({
    tag: 'startup',
    message: `Server listening on http://localhost:${config.PORT}`,
    port: config.PORT
  });
});
