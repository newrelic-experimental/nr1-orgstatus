module.exports = {
    allWorkloadsQuery: (accountId) => {
        return `
        {
            actor {
                account(id: ${accountId}) {                  
                  workload {
                    collections {
                      guid
                      name
                      entitySearchQuery                      
                    }
                  }
                }
              }
            }
  `},
    childEntitiesQuery: (entitySearchQuery) => {
        return `{
            actor {
                entitySearch(query: "${entitySearchQuery}") {
                    count                    
                    results {                       
                        entities {
                            guid
                            entityType
                            name                            
                        }
                    }
                }
            }
        }`
    }
};
