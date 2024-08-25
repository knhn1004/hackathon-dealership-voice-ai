import Link from 'next/link';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import React from 'react';

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
					<React.Fragment key={item.href}>
						<BreadcrumbItem>
							{index < items.length - 1 ? (
								<BreadcrumbLink asChild>
									<Link href={item.href}>{item.label}</Link>
								</BreadcrumbLink>
							) : (
								<BreadcrumbPage>{item.label}</BreadcrumbPage>
							)}
						</BreadcrumbItem>
						{index < items.length - 1 && <BreadcrumbSeparator />}
					</React.Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}