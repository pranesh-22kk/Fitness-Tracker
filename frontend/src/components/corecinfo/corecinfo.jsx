import {
	Box,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Paper,
	Stack,
	Typography
} from "@mui/material";
import { Wifi, LocalParking, FitnessCenter, School, LocalCafe } from '@mui/icons-material'; // Example icons
import { useState } from "react";

/*
 * Component to display features and a Google Map of Kongu Engineering College in Erode
 */
const CorecInfo = () => {
	// Sample features with icons for display
	const sampleFeatures = [
		{ name: "Library", icon: <School /> },
		{ name: "Free Wi-Fi", icon: <Wifi /> },
		{ name: "Cafeteria", icon: <LocalCafe /> },
		{ name: "Parking Available", icon: <LocalParking /> },
		{ name: "Sports Complex", icon: <FitnessCenter /> },
		// Add more features as needed
	];

	const [features] = useState(sampleFeatures);

	return (
		<Box sx={{
			width: '90%',
			maxWidth: 500,
			margin: '0 auto',  // Centered alignment
			bgcolor: "background.paper",
			boxShadow: 3,
			borderRadius: 3,
			p: 3,
		}}>
			<Stack direction="column" spacing={3}>
				<Paper
					elevation={4}
					sx={{
						padding: 2,
						borderRadius: 2,
						textAlign: 'center',
						boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
					}}
				>
					<Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
						College Features
					</Typography>
					<List dense>
						{features.map((feature) => (
							<ListItem key={feature.name} disablePadding sx={{ padding: 1 }}>
								<ListItemIcon sx={{ minWidth: 35, color: 'primary.main' }}>
									{feature.icon}
								</ListItemIcon>
								<ListItemText primary={feature.name} sx={{ fontSize: '0.9rem' }} />
							</ListItem>
						))}
					</List>
				</Paper>
				<Box sx={{
					borderRadius: 2,
					overflow: 'hidden',
					boxShadow: 2,
					border: '1px solid #e0e0e0'
				}}>
					<iframe
						title="Kongu Engineering College Map"
						width="100%"
						height="250"
						style={{ border: 0 }}
						loading="lazy"
						allowFullScreen
						src="https://maps.google.com/maps?q=Kongu%20Engineering%20College,%20Erode&amp;t=&amp;z=13&amp;ie=UTF8&amp;iwloc=&amp;output=embed"
					>
					</iframe>
				</Box>
			</Stack>
		</Box>
	);
};

export default CorecInfo;
