import { ImageComp } from "comps/comps/imageComp";
import { trans } from "i18n";
import Example from "../../common/Example";
import ExampleGroup from "../../common/ExampleGroup";

export default function ImageExample() {
  return (
    <>
      <ExampleGroup
        title={trans("componentDoc.basicUsage")}
        description="The Following Examples Show the Basic Usage of the Image Component."
      >
        <Example
          title="Image Source - HTTP URL"
          width={400}
          height={300}
          config={{
            src: "https://photographylife.com/wp-content/uploads/2023/05/Nikon-Z8-Official-Samples-00002.jpg",
          }}
          compFactory={ImageComp}
        />
        <Example
          title="Image Source - Data URL"
          width={400}
          height={300}
          config={{
            src: "data:image/jpeg;base64,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",
          }}
          compFactory={ImageComp}
        />
        <Example
          title="Support Preview for the Image on Click "
          width={400}
          height={300}
          config={{
            src: "https://photographylife.com/wp-content/uploads/2023/05/Nikon-Z8-Official-Samples-00002.jpg",
            supportPreview: true,
          }}
          compFactory={ImageComp}
        />
      </ExampleGroup>

      <ExampleGroup
        title="Layout & Alignment"
        description="The Following Examples Show the different Layout option of the Image Component."
      >
        <Example
          title="Image Placement - Top"
          width={400}
          height={500}
          config={{
            src: "https://photographylife.com/wp-content/uploads/2023/05/Nikon-Z8-Official-Samples-00002.jpg",
            placement: "top",
          }}
          compFactory={ImageComp}
        />
        <Example
          title="Image Placement - Bottom"
          width={400}
          height={500}
          config={{
            src: "https://photographylife.com/wp-content/uploads/2023/05/Nikon-Z8-Official-Samples-00002.jpg",
            placement: "bottom",
          }}
          compFactory={ImageComp}
        />
        <Example
          title="Image Placement - Left"
          width={600}
          height={300}
          config={{
            src: "https://photographylife.com/wp-content/uploads/2023/05/Nikon-Z8-Official-Samples-00002.jpg",
            placement: "left",
          }}
          compFactory={ImageComp}
        />
        <Example
          title="Image Placement - Right"
          width={600}
          height={300}
          config={{
            src: "https://photographylife.com/wp-content/uploads/2023/05/Nikon-Z8-Official-Samples-00002.jpg",
            placement: "right",
          }}
          compFactory={ImageComp}
        />
      </ExampleGroup>

      <ExampleGroup
        title="Styling Properties"
        description="The Following Examples Show the different Styling properties on the Image Component."
      >
        <Example
          title="Background Color, Border Radius,Style,Width,Color"
          width={400}
          height={300}
          config={{
            src: "https://photographylife.com/wp-content/uploads/2023/05/Nikon-Z8-Official-Samples-00002.jpg",
            style: {
              "margin": "20px",
              "background": "#00FFFF",
              "border": "#3377FF",
              "radius": "10px",
              "borderWidth": "3px",
              "borderStyle": "solid",
            },
          }}
          compFactory={ImageComp}
        />
        <Example
          title="Margin & Padding"
          width={400}
          height={300}
          config={{
            src: "https://photographylife.com/wp-content/uploads/2023/05/Nikon-Z8-Official-Samples-00002.jpg",
            style: {
              "background": "#00FFFF",
              "border": "#3377FF",
              "radius": "10px",
              "borderWidth": "3px",
              "margin": "10px",
              "padding": "10px",
              "borderStyle": "dashed",
            },
          }}
          compFactory={ImageComp}
        />
        <Example
          title="Opacity - 0.2"
          width={400}
          height={300}
          config={{
            src: "https://photographylife.com/wp-content/uploads/2023/05/Nikon-Z8-Official-Samples-00002.jpg",
            style: {
              "opacity": "0.2",
            },
          }}
          compFactory={ImageComp}
        />
        <Example
          title="Opacity - 0.5"
          width={400}
          height={300}
          config={{
            src: "https://photographylife.com/wp-content/uploads/2023/05/Nikon-Z8-Official-Samples-00002.jpg",
            style: {
              "opacity": "0.5",
            },
          }}
          compFactory={ImageComp}
        />
        <Example
          title="Opacity - 0.7"
          width={400}
          height={300}
          config={{
            src: "https://photographylife.com/wp-content/uploads/2023/05/Nikon-Z8-Official-Samples-00002.jpg",
            style: {
              "opacity": "0.7",
            },
          }}
          compFactory={ImageComp}
        />
        <Example
          title="Opacity - 1"
          width={400}
          height={300}
          config={{
            src: "https://photographylife.com/wp-content/uploads/2023/05/Nikon-Z8-Official-Samples-00002.jpg",
            style: {
              "opacity": "1",
            },
          }}
          compFactory={ImageComp}
        />
        <Example
          title="Rotation - 20deg"
          width={400}
          height={300}
          config={{
            src: "https://photographylife.com/wp-content/uploads/2023/05/Nikon-Z8-Official-Samples-00002.jpg",
            style: {
              "rotation": "20deg",
            },
          }}
          compFactory={ImageComp}
        />
      </ExampleGroup>

      <ExampleGroup
        title="Animation Style"
        description="The Following Examples Show different animations on the Cascader Component."
      >
        <Example
          title="Bounce Animation"
          width={400}
          height={300}
          config={{
            src: "https://photographylife.com/wp-content/uploads/2023/05/Nikon-Z8-Official-Samples-00002.jpg",
            animationStyle: {
              "animation": "bounce",
              "animationDelay": "1s",
              "animationDuration": "3s",
              "animationIterationCount": "infinite"
            },
          }}
          compFactory={ImageComp}
        />
        <Example
          title="Swing Animation"
          width={400}
          height={300}
          config={{
            src: "https://photographylife.com/wp-content/uploads/2023/05/Nikon-Z8-Official-Samples-00002.jpg",
            animationStyle: {
              "animation": "swing",
              "animationDelay": "1s",
              "animationDuration": "3s",
              "animationIterationCount": "infinite"
            },
          }}
          compFactory={ImageComp}
        />
        <Example
          title="Tada Animation"
          width={400}
          height={300}
          config={{
            src: "https://photographylife.com/wp-content/uploads/2023/05/Nikon-Z8-Official-Samples-00002.jpg",
            animationStyle: {
              "animation": "tada",
              "animationDelay": "1s",
              "animationDuration": "3s",
              "animationIterationCount": "infinite"
            },
          }}
          compFactory={ImageComp}
        />
      </ExampleGroup>
    </>
  );
}
