'use client'
import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from '@nextui-org/react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

function NavBar() {

    const { data: session } = useSession();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const menuItems = [

        { text: "Gestion Materias", link: "/managementSubjects" },
        { text: "Gestion Tutores", link: "/managementTutors" },
        { text: "Material de apoyo", link: "/materialSupport" },
    ];

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleSignOut = () => {
        setIsLoading(true)
        signOut();
        setIsLoading(false)
        router.push("/login");
    }


    return (
        <div className="fixed top-0 w-full z-10 shadow-md">
            {session?.user ? (
                <Navbar>
                    <NavbarMenuToggle
                        aria-label={isMenuOpen ? "Cerrar" : "Abrir"}
                        className="sm:hidden"
                    />
                    <NavbarBrand>
                        <p className="font-bold text-inherit">UPTC</p>
                    </NavbarBrand>
                    <NavbarContent className="hidden sm:flex gap-4" justify="center">
                        {menuItems.map((item, index) => (
                            <NavbarItem key={index}>
                                <Link color="foreground" href={item.link} onClick={toggleMenu}>
                                    {item.text}
                                </Link>
                            </NavbarItem>
                        ))}
                    </NavbarContent>
                    <NavbarContent justify="end">
                        <NavbarItem>
                            <Button color="danger" variant="flat" onClick={handleSignOut} isLoading={isLoading}>
                                Cerrar Sesión
                            </Button>
                        </NavbarItem>
                    </NavbarContent>
                    <NavbarMenu >
                        {menuItems.map((item, index) => (
                            <NavbarMenuItem key={index}>
                                <Link
                                    color="foreground"
                                    href={item.link}
                                    onClick={() => toggleMenu}
                                >
                                    {item.text}
                                </Link>
                            </NavbarMenuItem>
                        ))}
                    </NavbarMenu>
                </Navbar>
            ) : (

                <nav className="bg-zinc-800/85 ">
                    <div className="flex items-center justify-center space-x-10 h-16">
                        <Link
                            href="/"
                            className="w-32 h-7 hover:bg-slate-200/20 text-white rounded-md flex justify-center items-center"
                        >
                            Inicio
                        </Link>
                        <Link
                            href="/login"
                            className="w-32 h-7 hover:bg-slate-200/20 text-white rounded-md flex justify-center items-center"
                        >
                            Ingresar
                        </Link>
                        
                    </div>
                </nav>
            )}
        </div>
    );
}

export default NavBar