import { Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { CardAction, CardContent, Card, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { useState } from "react"
import { registerUser } from "../../store/auth/authSlice"
import { toast } from "sonner"
import Loader from "../../components/common/Loader"
import { useDispatch } from "react-redux"

const Register = () => {
    const [fullName, setfullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [phone, setPhone] = useState("")
    const dispatch = useDispatch();
    const handleSubmit = (e) => {
        e.preventDefault();
        setfullName("");
        setEmail("");
        setPassword("");
        setPhone("");

        try {
            console.log(fullName, email, password, phone);
            dispatch(registerUser({ fullName, email, password, phone })).then((data) => {

                if (data?.payload) {
                    toast("Registered Successfully")
                } else {
                    toast.error(data?.payload?.message || "Error While Registering User")
                }
            })
        } catch (error) {
            console.log(error);
            toast.error("Error While Registering User")
        }

    }
    return (
            <div className="w-full max-w-md space-y-8">
                <Card className="">
                    <h3 className="text-center text-4xl font-bold my-3 text-yellow-original">Welcome To Wearist!</h3>
                    <CardHeader>

                        <CardTitle>Regiser to your account</CardTitle>
                        <CardDescription>
                            Already have an account?
                        </CardDescription>
                        <CardAction>
                            <Link to={`/auth/login`}>
                                <Button variant="link">Sign In</Button>
                            </Link>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input
                                        id="fullName"
                                        type="text"
                                        placeholder="Malik Shehroz Ali"
                                        required
                                        value={fullName}
                                        onChange={(e) => setfullName(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                    </div>
                                    <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center mb-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                    </div>
                                    <Input id="phone" type="text" required placeholder="+923064239458" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </div>
                                <Button type="submit" className="w-full">
                                    Register
                                </Button>
                            </div>
                        </form>
                    </CardContent>

                </Card>

            </div>
    )
}

export default Register