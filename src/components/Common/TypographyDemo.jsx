import { Skeleton, Typography } from "@mui/material";

const variants = ['h1', 'h1', 'h1', 'h1'];
export default function TypographyDemo(props) {
    const { loading = true } = props;
    return (
        <div>
            {variants.map((variant) => (
                <Typography component="div" key={variant} variant={variant}>
                    {loading ? <Skeleton /> : variant}
                </Typography>
            ))}
        </div>
    );
}
