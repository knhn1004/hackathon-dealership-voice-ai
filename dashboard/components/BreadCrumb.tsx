import Link from 'next/link';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface BreadcrumbItemProps {
	label: string;
	href: string;
}

interface BreadcrumbProps {
	items: BreadcrumbItemProps[];
}

export function BreadcrumbNav({ items }: BreadcrumbProps) {
	return (
		<Breadcrumb>
			<BreadcrumbList>
				{items.map((item, index) => (
					<BreadcrumbItem key={item.href}>
						{index < items.length - 1 ? (
							<>
								<BreadcrumbLink asChild>
									<Link href={item.href}>{item.label}</Link>
								</BreadcrumbLink>
								<BreadcrumbSeparator />
							</>
						) : (
							<BreadcrumbPage>{item.label}</BreadcrumbPage>
						)}
					</BreadcrumbItem>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
