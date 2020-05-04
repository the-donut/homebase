const getNewsletterIdFromArticle = async (query, articleId) => {
  const GET_NEWSLETTER_id = `
    query getNewsletterId($id: ID!) {
      Article(where: { id: $id } ) {
        id
        newsletter {
          id
        }
      }
    }
  `

  const { errors, data } = await query(GET_NEWSLETTER_id, {
    variables: {
      id: articleId
    }
  });

  if(errors) {
    console.log("Error happened in article helper fn getNewsletterIdFromArticle:", errors)
    return null
  } else {
    return data.Article.newsletter ? data.Article.newsletter.id : null
  }
}

module.exports = {
  getNewsletterIdFromArticle: getNewsletterIdFromArticle
}