import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { api } from "@/api/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import FieldError from "@/components/FieldError"

function Register() {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting }, // isSubmitting = true dok čekamo odgovor backenda
    } = useForm()

    const navigate = useNavigate()

    const onSubmit = async (data) => {
        try {
            await api.post('/auth/register', {
                nickname: data.nickname,
                email: data.email,
                password: data.password,
            })
            navigate("/login")
        } catch (error) {
            setError("root", { message: error.response?.data?.message || "Registration failed" })
        }
    }

    // pravila u formi su ista kao u zod shemi na backendu, da korisnik grešku vidi odmah, bez slanja zahtjeva
    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('/forest.jpg')] bg-cover bg-center p-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Create an account</CardTitle>
                    <CardDescription>Start tracking your habits and goals.</CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* greška s backenda, npr. "User already exists" */}
                        {errors.root && (
                            <p className="text-sm text-destructive text-center">{errors.root.message}</p>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="nickname">Nickname</Label>
                            <Input
                                id="nickname"
                                placeholder="tea"
                                aria-invalid={!!errors.nickname}
                                {...register("nickname", {
                                    required: "Nickname is required",
                                    maxLength: { value: 50, message: "Nickname is too long" },
                                })}
                            />
                            <FieldError error={errors.nickname} />
                        </div>

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
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 8, message: "Password must be at least 8 characters" },
                                    maxLength: { value: 72, message: "Password is too long" },
                                })}
                            />
                            <FieldError error={errors.password} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Repeat password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                aria-invalid={!!errors.confirmPassword}
                                {...register("confirmPassword", {
                                    required: "Please repeat your password",
                                    // formValues = sve vrijednosti forme, pa usporedimo s upisanom lozinkom
                                    validate: (value, formValues) =>
                                        value === formValues.password || "Passwords do not match",
                                })}
                            />
                            <FieldError error={errors.confirmPassword} />
                        </div>

                        {/* gumb je onemogućen dok čekamo odgovor, da se zahtjev ne pošalje dvaput */}
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Creating account..." : "Sign up"}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="justify-center text-sm text-muted-foreground">
                    Already have an account?&nbsp;
                    <Link to="/login" className="text-foreground underline underline-offset-4">Log in</Link>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Register
