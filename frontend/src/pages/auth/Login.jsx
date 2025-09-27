import { Link, Navigate } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { CardAction, CardContent, Card, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { useState } from "react"
import { loginUser } from "../../store/auth/authSlice"
import { toast } from "sonner"
import Loader from "../../components/common/Loader"
import { useDispatch } from "react-redux"

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const dispatch = useDispatch();
    const handleSubmit = (e) => {
        e.preventDefault();
        setEmail("");
        setPassword("");
        try {
            dispatch(loginUser({ email, password })).then((data) => {
                if (data?.payload) {
                    toast("Login Successfully")
                } else {
                    toast.error(data?.payload?.message || "Error While Logging In")
                }
            })
        } catch (error) {
            console.log(error);
            toast.error("Error While Logged In")
        }
    }
    return (
        <div className="w-full max-w-md space-y-8">
            <Card className="">
                <h3 className="text-center text-4xl font-bold my-3 text-yellow-original">Welcome To Wearist!</h3>
                <CardHeader>

                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                    <CardAction>
                        <Link to={`/auth/register`}>
                            <Button variant="link">Sign Up</Button>
                        </Link>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input id="password" type="password" required name="password" value={password} onChange={e => setPassword(e.target.value)} />
                            </div>
                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

        </div>
    )
}

export default Login