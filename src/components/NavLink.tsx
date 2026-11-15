type Props = { to: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

/** Link interno: só troca o hash da URL, sem pedir uma nova página ao servidor. */
export function NavLink({ to, children, ...rest }: Props) {
  return (
    <a href={`#${to}`} {...rest}>
      {children}
    </a>
  );
}
