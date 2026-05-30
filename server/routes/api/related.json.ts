import { buildRelatedMap } from '../../utils/relatedPosts'

export default eventHandler(async (event) => {
  return buildRelatedMap(event)
})
