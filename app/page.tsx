import { EmailPreference, Role, User } from "@/generated/prisma/client";
export default async function Home() {
  
  // POST Test
  // const newUser: Partial<User> = {
  //   username: "mason",
  //   email: "humanmason123112329@mail.com",
  //   password: "mason123456789",
  //   birthdate: new Date(),
  //   role: Role.ADMIN,
  //   emailPreference: EmailPreference.SERVER_ONLY,
  // }

  // const response = await fetch(
  //   `${process.env.NEXT_PUBLIC_URL}/api/user`,
  //   {
  //     method: 'POST',
  //     body: JSON.stringify(newUser)
  //   }
  // )

  // PATCH Test - Soft delete / DELETE Test - Hard delete
  // const ids = [45, 46]

  // const response = await fetch(
  //   `${process.env.NEXT_PUBLIC_URL}/api/user`,
  //   {
  //     method: 'PATCH',
  //     body: JSON.stringify({ ids: ids })
  //   }
  // )

  // PATCH Test - Restore
  const ids = [44, 47]

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/user/restore`,
    {
      method: 'PATCH',
      body: JSON.stringify({ ids: ids })
    }
  )

  const body = await response.json();

  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <p>
        <span>Hello this is the birthday tracking app</span><br/>
        
        { !response.ok
          ? (
            <>
              <span>Status: {response.status}</span><br/>
              <span>Error: {body.error}</span><br/>
              { body.details && <span>Details: {body.details}</span> }
            </>
          )
          : (
            <>
              <div className="overflow-hidden text-ellipsis whitespace-break-spaces min-w-fit max-w-64">Result: {JSON.stringify(body)}</div>
            </>
          )
        }
      </p>
    </div>
  );
}
