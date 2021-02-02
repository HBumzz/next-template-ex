import { deserialize } from "./deserialize"
import { getEntities } from "./get-entities"

export async function getPathsForEntityType(
  entity_type: string,
  bundle: string,
  options: {
    params?: {}
    filter?: (entity) => boolean
  } = {
    filter: (_) => true,
  }
) {
  let entities = await getEntities(entity_type, bundle, options)
  if (!entities?.data?.length) {
    return []
  }

  entities = deserialize(entities)

  if (options.filter) {
    entities = entities.filter(options.filter)
  }

  return entities.map((entity) => {
    const slug =
      entity.path.alias === process.env.DRUPAL_FRONT_PAGE
        ? "/"
        : entity.path.alias
    return {
      params: {
        slug: `${slug.replace(/^\/|\/$/g, "")}`.split("/"),
      },
    }
  })
}