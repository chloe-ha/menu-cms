import MaxWidthContainer from "@/components/MaxWidthContainer";
import ScrollSpyNav from "@/components/ScrollSpyNav";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { getRestaurantData } from "@/lib/data";
import { getPageData } from "@/lib/data-mock";
import { cn, formatPrice } from "@/lib/utils";
import { Clock, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import React from "react";

export default async function Page() {
  const restaurant = await getRestaurantData();
  const { menus } = await getPageData()

  return (
    <main>
      {/* Banner */}
      {restaurant.images?.length ? (
        <Carousel className="w-full grid" opts={{ loop: true }}>
          <CarouselContent>
            {restaurant.images.map((image, index) => (
              <CarouselItem key={index} className="">
                <div key={image} className={cn("relative h-[150px]")}>
                  <Image src={image} alt="banner image" fill className="object-cover" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ): null}
      {/* General information */}
      <MaxWidthContainer>
        <div className="flex flex-col gap-4">
          {restaurant.name ? <h1 className="text-3xl sm:text-5xl font-bold">{restaurant.name}</h1>: null}
          {restaurant.description ? <p>{restaurant.description}</p>: null}
          {restaurant.address ? <span className="flex gap-1 items-center"><MapPin size={18} />{restaurant.address}</span>: null}
          {restaurant.phoneNumber ? <a className="flex gap-1 items-center" href={`tel:${restaurant.phoneNumber}`}><Phone size={18} />{restaurant.phoneNumber}</a>: null}
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="justify-start items-center py-0 gap-1"><Clock size={18} />Horaires d&apos;ouverture</AccordionTrigger>
              <AccordionContent className="flex flex-wrap p-2">
                {restaurant.openingHours.map(({ day, open, windows }) => {
                  const label = open && windows.length ? `${windows.map(({ from, to }) => from + ' à ' + to).join(', ')}`: open && !windows.length ? 'Ouvert': 'Fermé';
                  return (
                    <React.Fragment key={day}>
                      <div className="w-[125px]">{day}</div>
                      <div className="basis-[calc(100%-125px)]">{label}</div>
                    </React.Fragment>
                  )
                })}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </MaxWidthContainer>
      {/* Menu */}
      <div className="sticky top-0 z-1000 bg-primary-foreground">
        <ScrollSpyNav
          activeClass="text-red-500"
          offsetTop={80}
          rootMargin="-60px 0px 0px 0px"
        >
          <MaxWidthContainer>
            <nav className="overflow-x-auto">
              <ul className="flex items-center">
                <li>
                  <h2 className="text-xl sm:text-2xl font-bold pr-4">Menu</h2>
                </li>
                {menus.map((item) => (
                  <li key={item.uriFragment}className="flex">
                    <a
                      href={`#${item.uriFragment}`}
                      className="p-4 hover:underline"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </MaxWidthContainer>
        </ScrollSpyNav>
      </div>
      <MaxWidthContainer>
        <div className="flex flex-col gap-6">
          {menus.map(({ uriFragment, name, items }) => (
            <section key={name} id={uriFragment} className="flex flex-col gap-4">
              <h3 className="text-xl font-bold">{name}</h3>
              <ul className="flex flex-col gap-2">
                {items.map((item, index) => (
                  <li key={item.name + index}>
                    <div>{item.name}</div>
                    <div>{formatPrice(item.price)}</div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </MaxWidthContainer>
    </main>
  )
}
