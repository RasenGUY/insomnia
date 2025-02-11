'use client'

type SignInProps = Record<string, never>

const Connect: React.FC<SignInProps> = () => {
  return (
    <div className="mx-auto w-96 space-y-10">
      <h1 className="text-4xl font-extrabold mb-1 text-center">Sign In</h1>
    </div>
  )
}

export default Connect
