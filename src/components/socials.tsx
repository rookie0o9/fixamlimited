import { BsYelp } from "react-icons/bs";
import { RiLinkedinFill, RiTwitterXFill } from "react-icons/ri";

export default function Socials() {
  return (
    <>
      <a
        href="https://www.yelp.co.uk/biz/fixam"
        className="text-primary-foreground hover:text-primary-alternate"
        target="_blank"
        rel="noopener"
      >
        <span className="sr-only">Yelp link</span>
        <BsYelp className="h-5 w-5" />
      </a>
      <a
        href="https://x.com/fixamcouk"
        className="text-primary-foreground hover:text-primary-alternate"
        target="_blank"
        rel="noopener"
      >
        <span className="sr-only">twitter link</span>
        <RiTwitterXFill className="h-5 w-5" />
      </a>
      <a
        href="https://www.linkedin.com/company/fixam-co-uk"
        className="text-primary-foreground hover:text-primary-alternate"
        target="_blank"
        rel="noopener"
      >
        <span className="sr-only">linkedin link</span>
        <RiLinkedinFill className="h-5 w-5" />
      </a>
    </>
  );
}
