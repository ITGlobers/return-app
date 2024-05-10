import getGoodwillsService from '../../services/goodwill/getGoodwillService'
/**
 * @api {get} /_v/goodwill Retrieve Goodwill Credits
 * @apiName RetrieveGoodwillCredits
 * @apiGroup Goodwill
 * @apiVersion  3.16.35-hkignore
 * @apiHeader {String} VtexIdclientAutCookie Authentication token.
 * @apiHeader {String} Cookie Session cookie.
 *
 * @apiSuccess {Object[]} goodwillCredits List of goodwill credits.
 */
export async function getGoodwills(
  ctx: Context,
  next: () => Promise<any>
): Promise<any> {
  const {
    vtex: {
      route: {
        params: { id },
      },
    },
  } = ctx

  ctx.body = await getGoodwillsService(ctx, id as string)

  ctx.set('Cache-Control', 'no-cache')
  await next()
}
