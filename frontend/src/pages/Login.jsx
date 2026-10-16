import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import FieldError from "@/components/FieldError"

function Login() {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting }, // isSubmitting = true dok čekamo odgovor backenda
    } = useForm()

    const navigate = useNavigate()
    const { login } = useAuth()

    const onSubmit = async (data) => {
        try {
            await login(data.email, data.password)
            navigate("/dashboard")
        } catch (error) {
            setError("root", { message: error.response?.data?.message || error.message || "Login failed" })
        }
    }

    // izgled: kartica na sredini ekrana, ista pozadina kao na početnoj stranici
    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('/forest.jpg')] bg-cover bg-center p-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Log in</CardTitle>
                    <CardDescription>Welcome back! Enter your email and password.</CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* greška s backenda, npr. "Invalid email or password" */}
                        {errors.root && (
                            <p className="text-sm text-destructive text-center">{errors.root.message}</p>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                aria-invalid={!!errors.email}
                                {...register("email", { required: "Email is required" })}
                            />
                            <FieldError error={errors.email} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                aria-invalid={!!errors.password}
                                {...register("password", { required: "Password is required" })}
                            />
                            <FieldError error={errors.password} />
                        </div>

                        {/* gumb je onemogućen dok čekamo odgovor, da se zahtjev ne pošalje dvaput */}
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Logging in..." : "Log in"}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="justify-center text-sm text-muted-foreground">
                    Don't have an account?&nbsp;
                    <Link to="/register" className="text-foreground underline underline-offset-4">Sign up</Link>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Login
