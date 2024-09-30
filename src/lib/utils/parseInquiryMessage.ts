export function parseInquiryMessages(messages) {
  const newMessages = messages.reduce((acc, message, index) => {
    if (
      message.role === 'user' &&
      index > 0 &&
      messages[index - 1].content.startsWith('inquiry:')
    ) {
      let newContent = ''

      try {
        const userResponse = JSON.parse(message.content)
        console.log(userResponse)

        if (userResponse.action === 'skip') {
          // Skip this message and the previous one
          return acc.slice(0, -1)
        } else {
          const preferences = Object.entries(userResponse)
            .filter(
              ([key, value]) => value === 'on' && key !== 'additional_query'
            )
            .map(([key]) => key)

          newContent =
            preferences.length > 0 ? `I prefer ${preferences.join(', ')}` : ''

          if (userResponse.additional_query) {
            newContent += newContent
              ? `, ${userResponse.additional_query}`
              : userResponse.additional_query
          }

          newContent = newContent || 'I have no specific preferences'
        }

        acc.push({ ...message, content: newContent })
      } catch (error) {
        console.error('Error parsing user response:', error)
        acc.push(message)
      }
    } else {
      acc.push(message)
    }

    return acc
  }, [])

  return newMessages
}
