import { useEffect, useState } from "react";
import Head from "next/head";
import Layout from "@/components/layout";
import {
  PackageOpen,
  UploadCloud,
  Trash2,
  Loader2,
  Download,
} from "lucide-react";
import clsx from "clsx";
import { ReactCompareSlider } from "react-compare-slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

export default function Home() {
  const [prediction, setPrediction] = useState<any>(null);
  const [data, setData] = useState<{
    email: string | null;
    file: any;
  }>({ email: null, file: null });
  const [imageName, setImageName] = useState<any>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [sendEmail, setSendEmail] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [viewResult, setViewResult] = useState<boolean>(false);
  const [processingStatus, setProcessingStatus] = useState<string>("");
  const [fileSizeTooBig, setFileSizeTooBig] = useState<boolean>(false);
  const [fileIsNotImage, setFileIsNotImage] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setData((prev) => ({ ...prev, email: watch("email") }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("email")]);

  const sleep = (ms: any) => new Promise((r) => setTimeout(r, ms));

  const submitRequest = async () => {
    //start prediction
    setLoading(true);
    setProcessingStatus("pending");
    const response = await fetch("/api/prediction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(imageName),
    });
    let result = await response.json();

    if (response.status !== 201) {
      return;
    }
    setPrediction(result);
    while (result?.status !== "succeeded" && result?.status !== "failed") {
      await sleep(1000);
      const res = await fetch("/api/prediction/" + result.id);
      result = await res.json();
      if (res.status !== 200) {
        return;
      }
      setProcessingStatus(result?.status);
      setPrediction(result);
    }

    uploadToDB(result);
  };

  const uploadToDB = async (replicateData: any) => {
    if (replicateData.error !== null || replicateData.status !== "succeeded") {
      return;
    }

    //upload to cloudinary
    const formData = new FormData();
    formData.append("file", data.file);
    formData.append("upload_preset", "c2gcmzzv");
    const cloudinaryUpload = await fetch(
      "https://api.cloudinary.com/v1_1/dlidl2li4/image/upload",
      {
        method: "POST",
        body: formData,
      },
    );
    const cloudinaryResponse = await cloudinaryUpload.json();

    //call prisma api
    await fetch("/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        image_input: cloudinaryResponse.secure_url,
        image_output: replicateData.output,
        image_public_id: cloudinaryResponse.public_id,
      }),
    });
    setLoading(false);

    setProcessingStatus("succeeded");
    // const uploadResponse = await upload.json();
  };

  const toggleSendEmail = () => {
    setSendEmail(!sendEmail);
    setData((prev) => ({ ...prev, email: null }));
    reset();
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setFileSizeTooBig(false);
    setFileIsNotImage(false);
    setData((prev) => ({ ...prev, file: null }));
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    const validImageType = ["image/jpeg", "image/png"];
    if (file) {
      if (file.size / 1024 / 1024 > 5) {
        setFileSizeTooBig(true);
      } else if (!validImageType.includes(file.type)) {
        setFileIsNotImage(true);
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          setData((prev) => ({ ...prev, file: file }));
          setImageName(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const onChangeImage = (e: any) => {
    setFileSizeTooBig(false);
    setFileIsNotImage(false);
    setData((prev) => ({ ...prev, file: null }));
    const validImageType = ["image/jpeg", "image/png"];
    const file = e.currentTarget.files && e.currentTarget.files[0];
    if (file) {
      if (file.size / 1024 / 1024 > 5) {
        setFileSizeTooBig(true);
      } else if (!validImageType.includes(file.type)) {
        setFileIsNotImage(true);
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          setData((prev) => ({ ...prev, file: file }));
          setImageName(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const toDataURL = async (url: any) => {
    return await fetch(url)
      .then((response) => {
        return response.blob();
      })
      .then((blob) => {
        return URL.createObjectURL(blob);
      });
  };

  const downloadImage = async () => {
    if (prediction?.status !== "succeeded") return;
    const img = document.createElement("a");
    img.href = await toDataURL(prediction?.output);
    img.download = `brighten_${prediction.id}.png`;
    document.body.appendChild(img);
    img.click();
    document.body.removeChild(img);
  };

  const deleteImage = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setData((prev) => ({ ...prev, file: null }));
    setImageName(null);
  };

  const resetStates = () => {
    reset();
    setPrediction(null);
    setProcessingStatus("");
    setViewResult(false);
    setImageName(null);
    setSendEmail(false);
    setData({ email: null, file: null });
  };

  return (
    <>
      <Head>
        <title>Brighten.ai</title>
        <meta
          name="description"
          content="Improve low-light images and reduce noisy background"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="text-3xl font-extrabold tracking-wider lg:text-6xl">
          <span className="bg-gradient-to-tl from-gray-600/90 via-gray-400 to-gray-600 bg-clip-text text-transparent">
            Brighten.ai
          </span>
        </div>
        <div className="mt-2 text-center text-sm font-semibold text-gray-500 md:text-xl">
          Transform Dark Moments into Bright Treasures
        </div>
        <div className="mt-5 text-center text-sm font-normal text-gray-500 md:text-xl">
          Simply turns your low-light photos into bright clear images.
        </div>
        <Dialog>
          <DialogTrigger className="mt-2 rounded-full bg-black px-5 py-2 text-sm text-white duration-300 hover:scale-110">
            <PackageOpen className="mr-2 inline-block" size={18} />
            Try here!
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {viewResult ? "Result 🎊" : "Upload Photo"}
              </DialogTitle>
              <DialogDescription>
                Your photos will be automatically deleted after 24 hours
              </DialogDescription>
            </DialogHeader>
            {viewResult ? (
              <>
                <div className="rounded-b-lg border-t bg-slate-100/90 px-2 py-6 md:px-20">
                  <div className="relative aspect-video w-full rounded-lg border border-gray-300 bg-white animate-in fade-in slide-in-from-left-8 duration-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={prediction.output}
                      alt="Preview"
                      className="aspect-video h-full rounded-lg object-contain"
                    />
                    <button
                      type="button"
                      onClick={downloadImage}
                      className="absolute bottom-3 left-3 z-50 rounded-md bg-black bg-opacity-60 p-1 transition hover:bg-opacity-70"
                    >
                      <Download color={"#ffffff"} size={18} />
                    </button>
                  </div>
                  <div className="mt-4 animate-in fade-in slide-in-from-left-8 duration-700">
                    <p className="text-sm font-medium text-slate-600">Email</p>
                    <Input
                      type="email"
                      placeholder={data.email ?? "-"}
                      disabled
                      className="mt-3"
                    />
                  </div>
                  <Button
                    variant={"default"}
                    type="button"
                    className="mt-8 w-full"
                    onClick={() => setViewResult(false)}
                  >
                    Back
                  </Button>

                  <Button
                    variant={"destructive"}
                    type="button"
                    className="mt-2 w-full"
                    onClick={resetStates}
                  >
                    Reset
                  </Button>
                </div>
              </>
            ) : (
              <>
                <form noValidate onSubmit={handleSubmit(submitRequest)}>
                  <div className="rounded-b-lg border-t bg-slate-100/90 px-5 py-6 md:px-20 ">
                    <p className="text-sm font-medium text-slate-600 animate-in fade-in slide-in-from-left-8 duration-700">
                      Photo
                    </p>
                    <div className="animate-in fade-in slide-in-from-left-8 duration-700">
                      <label
                        htmlFor="image-upload"
                        className={clsx(
                          dragActive ? "border-gray-400" : "border-gray-300",
                          data.file && "border-none bg-white",
                          "group relative flex aspect-video cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed  transition duration-100 hover:border-gray-400",
                        )}
                      >
                        {data.file && (
                          <button
                            type="button"
                            onClick={deleteImage}
                            disabled={
                              loading || processingStatus === "succeeded"
                            }
                            className={clsx(
                              loading || processingStatus === "succeeded"
                                ? "cursor-not-allowed bg-opacity-30"
                                : "bg-opacity-60 hover:bg-opacity-70",
                              "absolute top-3 right-3 z-50 rounded-md bg-black p-1 transition",
                            )}
                          >
                            <Trash2
                              color={
                                loading || processingStatus === "succeeded"
                                  ? "#E4E4E4"
                                  : "#ffffff"
                              }
                              size={18}
                            />
                          </button>
                        )}
                        {fileSizeTooBig && (
                          <p className="text-sm text-red-500">
                            File size too big (less than 5MB)
                          </p>
                        )}
                        {fileIsNotImage && (
                          <p className="text-sm text-red-500">
                            File is not an image
                          </p>
                        )}
                        <div
                          onDragOver={handleDragOver}
                          onDragEnter={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          className={clsx(
                            "absolute z-40 aspect-video h-full w-full rounded-md border object-cover",
                          )}
                        ></div>
                        <div
                          className={clsx(
                            dragActive ? "text-gray-500/70" : "text-gray-400",
                            (data.file || fileSizeTooBig || fileIsNotImage) &&
                              "hidden",
                            "flex flex-col items-center justify-center text-center text-xs transition-all duration-100 group-hover:text-gray-500/70",
                          )}
                        >
                          <UploadCloud className="transition duration-100 group-hover:scale-110" />
                          <p>Drag & drop or click to upload</p>
                          <p>Accept image files only (Max at 5MB)</p>
                        </div>
                        {data.file && (
                          //eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={imageName ? imageName : undefined}
                            alt="Preview"
                            className="aspect-video h-full rounded-lg object-contain"
                          />
                        )}
                      </label>
                      <div className="z-30 mt-1 flex rounded-md shadow-lg">
                        <input
                          id="image-upload"
                          name="image"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={onChangeImage}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between animate-in fade-in slide-in-from-left-8 duration-700">
                      <p className="text-sm font-medium text-slate-600">
                        Send me via email
                      </p>
                      <Switch
                        checked={sendEmail}
                        onCheckedChange={toggleSendEmail}
                        disabled={loading || processingStatus === "succeeded"}
                      />
                    </div>
                    {sendEmail && (
                      <Input
                        type="email"
                        placeholder="Email"
                        className="mt-3 animate-in fade-in slide-in-from-bottom-3 duration-700"
                        {...register("email", {
                          required: {
                            value: sendEmail ? true : false,
                            message: "Email is required",
                          },
                          pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: "Email is not valid",
                          },
                        })}
                      />
                    )}
                    {sendEmail && (
                      <p className="mt-3 text-xs font-medium text-red-500 animate-in fade-in duration-700">
                        {errors.email?.message?.toString()}
                      </p>
                    )}
                    <div className="mt-4 border-t border-gray-300"></div>
                    {processingStatus !== "succeeded" ? (
                      <Button
                        variant={
                          data.file
                            ? sendEmail
                              ? errors.email == undefined
                                ? "able"
                                : "disable"
                              : "able"
                            : "disable"
                        }
                        disabled={
                          !data.file ||
                          loading ||
                          (sendEmail && errors.email !== undefined)
                        }
                        className="mt-4 w-full"
                        type="submit"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading
                          </>
                        ) : (
                          "Confirm Upload"
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant={"default"}
                        type="button"
                        className="mt-4 w-full"
                        onClick={() => setViewResult(true)}
                      >
                        View Result
                      </Button>
                    )}

                    {/* <Button className="w-full bg-emerald-400">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                  Loading
                </Button> */}
                  </div>
                </form>
              </>
            )}
          </DialogContent>
        </Dialog>
        <div className="mt-10 max-w-lg px-2 md:px-0">
          <ReactCompareSlider
            /* eslint-disable @next/next/no-img-element */
            itemOne={<img src="/input.png" alt="" className="rounded-xl" />}
            itemTwo={<img src="/out.jpg" alt="" className="rounded-xl" />}
            position={70}
          />
        </div>
      </Layout>
    </>
  );
}
