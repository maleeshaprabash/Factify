const NavLinks = [
    {label: 'Home', href: '#home'},
    {label: 'About US', href: '#aboutus'},
    {label: 'Analysis', href: '#analysis'},
]

function NavBar () {
    return(
        <nav
            id="nav"
            className="fixed flex top-0 left-0 right-0 z-50 justify-between pt-8 pb-4 px-20 backdrop-blur-md">
            
            <div className="flex items-center gap-4">
                <h1 
                    className="text-(--accent) font-syne font-extrabold text-[1.5rem] mdtext-[1.3rem] tracking-wide">
                    Factify
                </h1>
            </div>

            <div className="hidden md:flex gap-10 items-center">
                {NavLinks.map (({label, href}) => (
                    <a 
                        key={label}
                        href={href}
                        className="text-[0.7rem] tracking-[0.1rem] font-dm-mono uppercase text-(--muted) relative hover:text-(--text) transition-colors duration-200"
                    >
                        {label}
                    </a>   
                ))}
            </div>
            
            <div className="hidden md:flex gap-5 text-[0.6rem]">
                <a
                href="#signup"
                className="text-(--text) flex px-6 py-2 tracking-[0.2rem] uppercase border border-(--muted) rounded transition-all duration-300 hover:border-(--accent) hover:text-(--accent)">
                    Log In
                </a>
                <a
                    href="#signup"
                    className="text-(--surface) flex px-6 py-2 tracking-[0.2rem] uppercase border bg-(--accent) border-(--accent) rounded transition-all duration-300 hover:bg-(--surface) hover:text-(--accent)">
                        Sign UP
                </a>
            </div>
            
        </nav>
    )
}

export default NavBar