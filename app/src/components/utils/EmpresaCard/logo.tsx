interface LogoProps {
  logo: string;
  alt: string;
  width?: string;
}

function Logo({ logo, alt, width }: LogoProps) {
  return <img src={logo} alt={alt} width={width}/>
}

export default Logo;
