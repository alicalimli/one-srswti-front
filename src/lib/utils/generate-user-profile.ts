export function generateUserProfileInfo(userProfile: ProfileType): string {
  const name = `${userProfile?.firstName || ''} ${
    userProfile?.lastName || ''
  }`.trim()
  const age = userProfile?.age || ''
  const interests =
    userProfile?.interests?.map(interest => interest.label).join(', ') || ''
  const education = userProfile?.school || ''
  const preferredLanguage = userProfile?.preferredLanguage?.name || ''
  const description = userProfile?.description || ''

  return `
  User Information:

    Name: ${name}
    Age: ${age}
    Interests: ${interests}
    Education: ${education}
    Preferred Language: ${preferredLanguage}
    Self-description: ${description}
    Ensure the language model is aware of the user's profile, but avoid directly referencing or personalizing responses based on this information unless it is explicitly relevant to the query.
`
}
