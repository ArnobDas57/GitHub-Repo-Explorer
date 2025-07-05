import { Box, Typography } from "@mui/material"; 

const Footer = () => {
  return (
    <Box
      component="footer" 
      sx={{
        width: "100%",
        padding: 2, 
        backgroundColor: "rgba(0, 0, 0, 0.7)", 
        color: "rgba(255, 255, 255, 0.8)", 
        textAlign: "center", 
        fontSize: { xs: "0.8rem", sm: "1rem" }, 

      }}
    >
      <Typography
        variant="body2"
        component="span"
        sx={{ display: "inline-block" }}
      >
        Built by{" "}
        <a
          href="https://github.com/arnobdas57" 
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#3CCBFB",
            textDecoration: "none", 
            fontWeight: "bold",
            transition:
              "color 0.3s ease-in-out, text-decoration 0.3s ease-in-out",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.textDecoration = "underline")
          }
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
        >
          Arnob Das
        </a>{" "}
        © {new Date().getFullYear()}
      </Typography>
    </Box>
  );
};

export default Footer;
