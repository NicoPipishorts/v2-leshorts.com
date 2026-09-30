import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import { FiCoffee, FiTool, FiUsers, FiWind, FiZap } from "react-icons/fi";
import {
	SiClaude,
	SiDocker,
	SiExpo,
	SiFastify,
	SiNextdotjs,
	SiNodedotjs,
	SiPostgresql,
	SiPrisma,
	SiReact,
	SiReactquery,
	SiRedis,
	SiStrapi,
	SiSupabase,
	SiTailwindcss,
	SiTypescript,
	SiVite,
} from "react-icons/si";
import { history, me } from "../data";
import { Reveal } from "../shared";
import { Tile, Tilt } from "./Layout";

const TOOLS: [IconType, string][] = [
	[SiReact, "React"],
	[SiTypescript, "TypeScript"],
	[SiReactquery, "TanStack"],
	[SiNextdotjs, "Next.js"],
	[SiTailwindcss, "Tailwind"],
	[SiVite, "Vite"],
	[SiExpo, "Expo"],
	[SiNodedotjs, "Node.js"],
	[SiFastify, "Fastify"],
	[SiPrisma, "Prisma"],
	[SiPostgresql, "PostgreSQL"],
	[SiSupabase, "Supabase"],
	[SiStrapi, "Strapi"],
	[SiRedis, "Redis"],
	[SiDocker, "Docker"],
	[SiClaude, "Claude Code"],
];

const OFF: [IconType, string, string][] = [
	[FiWind, "Paragliding", "Flying the Alps whenever the weather says yes."],
	[FiZap, "Skating", "Still falling, still getting back up."],
	[FiTool, "Woodworking", "Furniture, renovation, the joy of square cuts."],
	[FiUsers, "Nonprofit", "President of the school parents’ association."],
	[FiCoffee, "Curiosity", "Product, UX research and whatever’s new this week."],
];

const BentoAbout = () => (
	<>
		<section className='grid gap-4 md:grid-cols-12'>
			<motion.div className='md:col-span-5' initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 80, damping: 16, delay: 0.2 }}>
				<Tilt className='aspect-[4/5] overflow-hidden rounded-[28px]'>
					<img src={me.photo} alt={me.name} className='h-full w-full object-cover' />
				</Tilt>
			</motion.div>
			<motion.div className='md:col-span-7' initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 80, damping: 16, delay: 0.3 }}>
				<Tile className='flex h-full flex-col justify-center p-7 md:p-12'>
					<p className='font-mono text-xs uppercase tracking-[0.14em] text-[#1d232b]/60'>About me</p>
					<h1 className='font-display mt-4 text-4xl font-extrabold leading-[1.05] tracking-[-0.035em] md:text-6xl'>
						Coding since <span className='text-[#dc5c48]'>2001</span>. Shipping since forever.
					</h1>
					<div className='mt-6 space-y-4 text-lg text-[#1d232b]/75'>
						<p>
							I’m a senior frontend engineer specialised in React & TypeScript — component architecture, state, design systems, performance and
							accessibility — with the backend and infra chops to take a product from idea to production.
						</p>
						<p>
							I co-founded Kaast (4,000+ users across 5 companies), I’m building Synqit, and through my studio Vue d’Esprit I’ve shipped web, mobile
							and back-office products for clients like Com’Academy, ASBA Drums and Horizon Planning.
						</p>
					</div>
					<a href={me.cvUrl} className='mt-8 self-start rounded-full bg-[#1d232b] px-6 py-3 font-semibold text-white transition-transform hover:scale-105'>
						Download CV ↓
					</a>
				</Tile>
			</motion.div>
		</section>

		<section className='mt-20'>
			<h2 className='font-display mb-6 px-2 text-4xl font-extrabold tracking-[-0.035em] md:text-5xl'>Experience</h2>
			<div className='relative space-y-4 pl-6 md:pl-10'>
				<div className='absolute bottom-4 left-2 top-4 w-[2px] rounded-full bg-gradient-to-b from-[#dc5c48] via-[#488b9b] to-[#b79a77] md:left-4' />
				{history.map((h, i) => (
					<Reveal key={h.company + h.title} delay={i * 0.04} className='relative'>
						<span className='absolute -left-[22px] top-8 h-3 w-3 rounded-full border-2 border-white bg-[#dc5c48] shadow md:-left-[30px]' />
						<Tile className='grid gap-2 p-6 md:grid-cols-12 md:gap-6'>
							<p className='font-mono text-sm text-[#dc5c48] md:col-span-2'>{h.period}</p>
							<div className='md:col-span-4'>
								<h3 className='font-display text-2xl font-extrabold tracking-tight'>{h.company}</h3>
								<p className='text-[#1d232b]/60'>{h.title}</p>
							</div>
							<p className='text-[#1d232b]/75 md:col-span-6'>
								{h.body}{" "}
								{h.slug && (
									<Link to='/bento/work/$slug' params={{ slug: h.slug }} className='font-semibold text-[#dc5c48] hover:underline'>
										Case study →
									</Link>
								)}
							</p>
						</Tile>
					</Reveal>
				))}
			</div>
		</section>

		<section className='mt-20'>
			<h2 className='font-display mb-6 px-2 text-4xl font-extrabold tracking-[-0.035em] md:text-5xl'>Toolbox</h2>
			<div className='grid grid-cols-4 gap-3 sm:grid-cols-8'>
				{TOOLS.map(([Icon, name], i) => (
					<motion.div
						key={name}
						initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
						whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
						viewport={{ once: true }}
						whileHover={{ y: -8, rotate: i % 2 ? 6 : -6 }}
						transition={{ delay: i * 0.035, type: "spring", stiffness: 220, damping: 14 }}>
						<Tile className='flex aspect-square flex-col items-center justify-center gap-2 p-3'>
							<Icon className='text-3xl transition-colors group-hover:text-[#dc5c48]' />
							<span className='text-center text-[11px] font-semibold'>{name}</span>
						</Tile>
					</motion.div>
				))}
			</div>
		</section>

		<section className='mt-20'>
			<h2 className='font-display mb-6 px-2 text-4xl font-extrabold tracking-[-0.035em] md:text-5xl'>Off the keyboard</h2>
			<div className='grid gap-4 md:grid-cols-5'>
				{OFF.map(([Icon, title, body], i) => (
					<Reveal key={title} delay={i * 0.06}>
						<Tile className='h-full p-6' glow='rgba(72,139,155,.25)'>
							<Icon className='text-3xl text-[#488b9b]' />
							<h3 className='font-display mt-4 text-xl font-extrabold'>{title}</h3>
							<p className='mt-1 text-sm text-[#1d232b]/70'>{body}</p>
						</Tile>
					</Reveal>
				))}
			</div>
		</section>
	</>
);

export default BentoAbout;
